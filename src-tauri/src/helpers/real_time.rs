use notify::{RecursiveMode, Watcher};
use once_cell::sync::Lazy;
use std::{
    collections::HashSet,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};
use tauri_plugin_notification::NotificationExt;

static NOTIFIED: Lazy<Mutex<HashSet<PathBuf>>> = Lazy::new(|| Mutex::new(HashSet::new()));
pub static REALTIME_ENABLED: AtomicBool = AtomicBool::new(false);
static SCAN_QUEUE: Lazy<Arc<Mutex<HashSet<PathBuf>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashSet::new())));
static BEHAVIOR: Lazy<Arc<Mutex<BehaviorConfig>>> =
    Lazy::new(|| Arc::new(Mutex::new(behavior_config(BehaviorMode::Balanced))));

use crate::{
    antivirus::{quarantine::quarantine_file},
    helpers::{
        get_exclusions,
        matcher::{EXCLUSIONS, ExclusionMatcher},
        path::{get_clamav_path, path_to_regex},
        silent_command,
    },
    types::{enums::BehaviorMode, structs::BehaviorConfig},
};

fn behavior_config(mode: BehaviorMode) -> BehaviorConfig {
    match mode {
        BehaviorMode::Balanced => BehaviorConfig {
            scan_extensions: vec!["exe", "dll", "js", "vbs", "bat", "ps1", "pdf", "zip", "com"],
            auto_quarantine: true,
            rescan_on_modify: false,
        },
        BehaviorMode::Safe => BehaviorConfig {
            scan_extensions: vec!["exe", "dll", "js", "vbs", "bat", "ps1", "com"],
            auto_quarantine: false,
            rescan_on_modify: false,
        },
        BehaviorMode::Strict => BehaviorConfig {
            scan_extensions: vec![
                "exe", "dll", "js", "vbs", "bat", "ps1", "pdf", "zip", "com", "txt",
            ],
            auto_quarantine: true,
            rescan_on_modify: true,
        },
        BehaviorMode::Expert => BehaviorConfig {
            scan_extensions: vec![],
            auto_quarantine: false,
            rescan_on_modify: true,
        },
    }
}

fn start_watcher(paths: Vec<String>) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No paths provided for monitoring".into());
    }
    let queue = SCAN_QUEUE.clone();
    let behavior = BEHAVIOR.clone();

    thread::spawn(move || {
        let (tx, rx) = std::sync::mpsc::channel();
        let mut watcher = match notify::recommended_watcher(tx) {
            Ok(w) => w,
            Err(e) => {
                eprintln!("Failed to create file watcher: {}", e);
                return;
            }
        };
        let mut failed_paths = Vec::new();
        for path in &paths {
            if let Err(e) = watcher.watch(path.as_ref(), RecursiveMode::Recursive) {
                eprintln!("Failed to watch path {}: {}", path, e);
                failed_paths.push(path.clone());
            }
        }
        if failed_paths.len() == paths.len() {
            eprintln!("All paths failed to watch, stopping watcher");
            REALTIME_ENABLED.store(false, Ordering::Relaxed);
            return;
        }

        while REALTIME_ENABLED.load(Ordering::Relaxed) {
            match rx.recv_timeout(Duration::from_secs(1)) {
                Ok(Ok(event)) => {
                    let behavior = behavior.lock().unwrap();
                    let mut q = queue.lock().unwrap();
                    let exclusions = EXCLUSIONS.lock().unwrap();

                    for path in event.paths {
                        if let Some(ref matcher) = *exclusions {
                            if matcher.is_excluded(&path) {
                                continue;
                            }
                        }
                        if should_scan(&path, &behavior) {
                            q.insert(path);
                        }
                    }
                }
                Ok(Err(e)) => {
                    eprintln!("File watcher error: {}", e);
                }
                Err(_) => {}
            }
        }
    });

    Ok(())
}

fn start_scan_worker(app: tauri::AppHandle, log_id: String) {
    let queue = SCAN_QUEUE.clone();
    let behavior = BEHAVIOR.clone();

    thread::spawn(move || {
        while REALTIME_ENABLED.load(Ordering::Relaxed) {
            thread::sleep(Duration::from_secs(3));
            let batch: Vec<PathBuf> = {
                let mut q = queue.lock().unwrap();
                q.drain().collect()
            };
            if batch.is_empty() {
                continue;
            }
            let behavior = behavior.lock().unwrap();

            for path in batch {
                match scan_file(&path) {
                    Ok(Some(threat_name)) => {
                        let mut notified = NOTIFIED.lock().unwrap();
                        if notified.contains(&path) {
                            continue;
                        }
                        notified.insert(path.clone());
                        drop(notified);
                        let notification_title = if behavior.auto_quarantine {
                            "Threat blocked"
                        } else {
                            "Threat detected"
                        };

                        let notification_body =
                            format!("Threat: {}\nFile:\n{}", threat_name, path.display());

                        if let Err(e) = app
                            .notification()
                            .builder()
                            .title(notification_title)
                            .body(&notification_body)
                            .show()
                        {
                            eprintln!("Failed to show notification: {}", e);
                        }

                        if behavior.auto_quarantine {
                            if let Err(e) = quarantine_file(
                                app.clone(),
                                path.to_string_lossy().to_string(),
                                threat_name,
                                Some(log_id.clone()),
                            ) {
                                eprintln!("Failed to quarantine {}: {}", path.display(), e);
                            }
                        }
                    }
                    Ok(None) => {}
                    Err(e) => {
                        eprintln!("Scan error for {:?}: {}", path, e);
                    }
                }
            }
        }
    });
}

fn should_scan(path: &Path, behavior: &BehaviorConfig) -> bool {
    if !path.is_file() {
        return false;
    }
    if behavior.scan_extensions.is_empty() {
        return true;
    }
    match path.extension().and_then(|e| e.to_str()) {
        Some(ext) => {
            let ext_lower = ext.to_lowercase();
            behavior
                .scan_extensions
                .iter()
                .any(|e| e.eq_ignore_ascii_case(&ext_lower))
        }
        None => false,
    }
}

fn scan_file(path: &Path) -> Result<Option<String>, String> {
    let exclusions = EXCLUSIONS.lock().unwrap();
    if let Some(ref matcher) = *exclusions {
        if matcher.is_excluded(path) {
            return Ok(None);
        }
    }
    if !path.exists() {
        return Err("File no longer exists".into());
    }
    let scanner = get_clamav_path()?;
    let output = silent_command(&scanner)
        .arg("--no-summary")
        .arg(path)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    if output.status.code() == Some(1) {
        if let Some(line) = stdout.lines().find(|l| l.contains(" FOUND")) {
            if let Some((_, rest)) = line.split_once(": ") {
                if let Some((name, _)) = rest.split_once(" FOUND") {
                    return Ok(Some(name.trim().to_string()));
                }
            }
        }
        return Ok(Some("Unknown.Threat".into()));
    }

    if let Some(code) = output.status.code() {
        if code != 0 {
            eprintln!("Clamscan exited with code {} for {:?}", code, path);
        }
    }
    Ok(None)
}

pub fn start_realtime_scan(
    app: tauri::AppHandle,
    paths: Vec<String>,
    mode: BehaviorMode,
    log_id: String,
) -> Result<(), String> {
    {
        let exclusions = get_exclusions(&app)?; // Vec<ExclusionsItem>

        let patterns: Vec<String> = exclusions
            .into_iter()
            .map(|e| path_to_regex(&e)) // or convert path → regex here
            .collect();

        let matcher = ExclusionMatcher::new(patterns).map_err(|e| e.to_string())?;

        *EXCLUSIONS.lock().unwrap() = Some(matcher);
    }
    if paths.is_empty() {
        return Err("No paths provided for real-time scanning".into());
    }
    let mut invalid_paths = Vec::new();
    for path in &paths {
        let p = PathBuf::from(path);
        if !p.exists() {
            invalid_paths.push(path.clone());
        }
    }
    if !invalid_paths.is_empty() {
        return Err(format!(
            "The following paths do not exist: {}",
            invalid_paths.join(", ")
        ));
    }
    {
        let mut behavior = BEHAVIOR.lock().unwrap();
        *behavior = behavior_config(mode);
    }
    if REALTIME_ENABLED.swap(true, Ordering::Relaxed) {
        REALTIME_ENABLED.store(false, Ordering::Relaxed);
        thread::sleep(Duration::from_millis(200));

        SCAN_QUEUE.lock().unwrap().clear();
        NOTIFIED.lock().unwrap().clear();

        REALTIME_ENABLED.store(true, Ordering::Relaxed);
    }
    start_watcher(paths)?;
    start_scan_worker(app, log_id);

    Ok(())
}

pub fn stop_realtime_scan() {
    REALTIME_ENABLED.store(false, Ordering::Relaxed);
    *EXCLUSIONS.lock().unwrap() = None;
    thread::sleep(Duration::from_millis(100));
    SCAN_QUEUE.lock().unwrap().clear();
    NOTIFIED.lock().unwrap().clear();
}
