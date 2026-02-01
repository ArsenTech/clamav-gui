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

static REALTIME_ENABLED: AtomicBool = AtomicBool::new(false);
static SCAN_QUEUE: Lazy<Arc<Mutex<HashSet<PathBuf>>>> =
    Lazy::new(|| Arc::new(Mutex::new(HashSet::new())));

use crate::helpers::{resolve_command, silent_command};

fn start_watcher(paths: Vec<String>) {
    let queue = SCAN_QUEUE.clone();

    thread::spawn(move || {
        let (tx, rx) = std::sync::mpsc::channel();
        let mut watcher = notify::recommended_watcher(tx).unwrap();

        for path in paths {
            watcher
                .watch(path.as_ref(), RecursiveMode::Recursive)
                .unwrap();
        }
        while REALTIME_ENABLED.load(Ordering::Relaxed) {
            if let Ok(Ok(event)) = rx.recv() {
                let mut q = queue.lock().unwrap();
                for path in event.paths {
                    if should_scan(&path) {
                        q.insert(path);
                    }
                }
            }
        }
    });
}

fn start_scan_worker() {
    let queue = SCAN_QUEUE.clone();

    thread::spawn(move || {
        while REALTIME_ENABLED.load(Ordering::Relaxed) {
            thread::sleep(Duration::from_secs(3));
            let batch: Vec<PathBuf> = {
                let mut q = queue.lock().unwrap();
                q.drain().collect()
            };
            for path in batch {
                match scan_file(&path) {
                    Ok(true) => {
                        println!("INFECTED: {:?}", path);
                        // TODO: quarantine + tauri emit
                    }
                    Ok(false) => {}
                    Err(e) => eprintln!("Scan error {:?}: {}", path, e),
                }
            }
        }
    });
}

fn should_scan(path: &Path) -> bool {
    if !path.is_file() {
        return false;
    }
    if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
        if name.starts_with('~') || name.ends_with(".tmp") {
            return false;
        }
    }
    matches!(
        path.extension().and_then(|e| e.to_str()),
        Some("exe" | "dll" | "js" | "vbs" | "bat" | "ps1" | "pdf" | "zip")
    )
}

fn scan_file(path: &Path) -> Result<bool, String> {
    let clamscan = resolve_command("clamscan")?;
    let status = silent_command(clamscan.to_str().unwrap())
        .arg("--no-summary")
        .arg(path)
        .status()
        .map_err(|e| e.to_string())?;

    Ok(status.code() == Some(1)) // infected
}

pub fn start_realtime_scan(paths: Vec<String>) {
    if REALTIME_ENABLED.swap(true, Ordering::Relaxed) {
        return; // already running
    }
    start_watcher(paths);
    start_scan_worker();
}

pub fn stop_realtime_scan() {
    REALTIME_ENABLED.store(false, Ordering::Relaxed);
}
