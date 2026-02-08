use std::{
    io::{BufRead as _, BufReader},
    path::PathBuf,
    process::{Command, Stdio},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc, Mutex,
    },
};
use tauri::{path::PathResolver, Emitter, Wry};
use walkdir::WalkDir;

use crate::{
    helpers::{
        history::append_scan_history, log::{log_err, log_info, log_path}, matcher::EXCLUSIONS, new_id, path::get_clamav_path, silent_command
    },
    types::{
        enums::{HistoryStatus, LogCategory, ScanResult, ScanType},
        structs::{HistoryItem, StartupScan},
    },
};

pub fn estimate_total_files(paths: &[PathBuf]) -> u64 {
    let exclusions = EXCLUSIONS.lock().unwrap();
    paths
        .iter()
        .flat_map(|p| WalkDir::new(p).max_depth(10).into_iter())
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
        .filter(|e| {
            exclusions
                .as_ref()
                .map(|m| !m.is_excluded(e.path()))
                .unwrap_or(true)
        })
        .count() as u64
}

pub static SCAN_PROCESS: once_cell::sync::Lazy<Mutex<Option<u32>>> =
    once_cell::sync::Lazy::new(|| Mutex::new(None));

pub fn run_scan(
    app: tauri::AppHandle,
    log_id: String,
    mut cmd: Command,
    scan_type: ScanType,
) -> Result<(), String> {
    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        if guard.is_some() {
            return Err("Scan already running".into());
        }
        *guard = Some(0);
    }

    let log_path = log_path(&app, LogCategory::Scan, &log_id);
    let log_file = Arc::new(Mutex::new(
        std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .map_err(|e| e.to_string())?,
    ));

    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = Some(child.id());
    }

    let threats_count = Arc::new(AtomicUsize::new(0));

    let stdout_handle = if let Some(out) = child.stdout.take() {
        let app_clone = app.clone();
        let log_clone = log_file.clone();
        let threats_clone = threats_count.clone();

        Some(std::thread::spawn(move || {
            for line in BufReader::new(out).lines().flatten() {
                if line.contains("FOUND") {
                    threats_clone.fetch_add(1, Ordering::Relaxed);
                }
                let _ = app_clone
                    .emit("clamscan:log", &line)
                    .map_err(|e| e.to_string());
                log_info(&log_clone, &line);
            }
        }))
    } else {
        None
    };

    let stderr_handle = if let Some(err) = child.stderr.take() {
        let app_clone = app.clone();
        let log_clone = log_file.clone();

        Some(std::thread::spawn(move || {
            for line in BufReader::new(err).lines().flatten() {
                let _ = app_clone
                    .emit("clamscan:log", &line)
                    .map_err(|e| e.to_string());
                log_err(&log_clone, &line);
            }
        }))
    } else {
        None
    };

    let exit_code = child.wait().ok().and_then(|s| s.code()).unwrap_or(-1);

    if let Some(handle) = stdout_handle {
        handle.join().ok();
    }
    if let Some(handle) = stderr_handle {
        handle.join().ok();
    }

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = None;
    }

    let found = threats_count.load(Ordering::Relaxed);

    let (status, scan_result, details) = match exit_code {
        0 => (
            HistoryStatus::Success,
            ScanResult::Clean,
            "Scan completed successfully, no threats found".to_string(),
        ),
        1 => (
            HistoryStatus::Warning,
            ScanResult::ThreatsFound,
            format!(
                "Scan completed successfully, {} threat{} found",
                found,
                if found == 1 { "" } else { "s" }
            ),
        ),
        2 => (
            HistoryStatus::Warning,
            ScanResult::Partial,
            "Some files could not be scanned due to access restrictions".to_string(),
        ),
        _ => (
            HistoryStatus::Error,
            ScanResult::Failed,
            format!("Scan failed (exit code {})", exit_code),
        ),
    };

    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Finished".into(),
            details,
            status,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id),
            scan_type: Some(scan_type),
            threat_count: Some(found as u32),
            scan_result: Some(scan_result),
        },
        &log_file,
    );

    app.emit("clamscan:finished", exit_code)
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_root_path() -> &'static str {
    if cfg!(windows) {
        "C:\\"
    } else {
        "/"
    }
}

pub fn get_main_paths(resolver: &PathResolver<Wry>) -> Vec<PathBuf> {
    let mut paths: Vec<PathBuf> = [
        resolver.audio_dir(),
        resolver.desktop_dir(),
        resolver.document_dir(),
        resolver.download_dir(),
        resolver.home_dir(),
        resolver.local_data_dir(),
        resolver.picture_dir(),
        resolver.public_dir(),
        resolver.temp_dir(),
        resolver.video_dir(),
    ]
    .into_iter()
    .flatten() // remove None
    .collect();
    paths.retain(|p| p.exists());
    #[cfg(debug_assertions)]
    for p in &paths {
        println!("Main scan path: {}", p.display());
    }
    paths
}

pub fn run_headless_scan(startup: StartupScan) -> Result<(), String> {
    let scan_type = match startup.scan_type {
        Some(s) => s,
        None => return Ok(()),
    };
    let scanner = get_clamav_path()?;
    let mut cmd = silent_command(&scanner);
    let mut paths = Vec::new();
    if let Some(home) = std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }) {
        let home = PathBuf::from(home);
        paths.push(home.join("Desktop"));
        paths.push(home.join("Documents"));
        paths.push(home.join("Downloads"));
    }
    if cfg!(windows) {
        paths.push(PathBuf::from("C:\\Program Files"));
        paths.push(PathBuf::from("C:\\Program Files (x86)"));
    } else {
        paths.push(PathBuf::from("/usr"));
        paths.push(PathBuf::from("/home"));
    }
    let exclusions = EXCLUSIONS.lock().unwrap();
    paths.retain(|p| {
        exclusions
            .as_ref()
            .map(|m| !m.is_excluded(p))
            .unwrap_or(true)
    });
    match scan_type {
        ScanType::Main => {
            cmd.args([
                "--recursive",
                "--heuristic-alerts",
                "--alert-encrypted",
                "--max-filesize=100M",
                "--max-scansize=400M",
            ]);
            #[cfg(debug_assertions)]
            for p in &paths {
                println!("Headless scan path: {}", p.display());
            }
            for path in paths {
                cmd.arg(path);
            }
        }
        ScanType::Full => {
            cmd.args([
                "--recursive",
                "--cross-fs=yes",
                "--heuristic-alerts",
                "--alert-encrypted",
                get_root_path(),
            ]);
        }
        _ => return Ok(()),
    }

    let status = cmd.status().map_err(|e| e.to_string())?;
    match status.code() {
        Some(0) | Some(1) => Ok(()),
        Some(2) => Err("ClamAV scan error".into()),
        _ => Err("Scan failed".into()),
    }
}

pub fn fetch_custom_scan_args(args: Option<Vec<String>>, has_directory: bool) -> Vec<String> {
    let mut default_args = vec![
        "--heuristic-alerts".to_string(),
        "--alert-encrypted".to_string(),
        "--max-filesize=100M".to_string(),
        "--max-scansize=400M".to_string(),
        "--verbose".to_string(),
        "--no-summary".to_string(),
    ];
    if has_directory {
        default_args.push("--recursive".to_string());
    }
    if let Some(args) = args {
        args
    } else {
        default_args
    }
}
