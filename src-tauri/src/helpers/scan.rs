use std::io::{BufRead as _, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use tauri::Emitter;
use walkdir::WalkDir;

use crate::helpers::{resolve_command, silent_command};
use crate::types::structs::StartupScan;
use crate::{
    helpers::{
        history::append_scan_history,
        log::{log_err, log_info, log_path},
        new_id,
    },
    types::{
        enums::{HistoryStatus, LogCategory, ScanResult, ScanType},
        structs::HistoryItem,
    },
};

pub fn estimate_total_files(paths: &[PathBuf]) -> u64 {
    paths
        .iter()
        .flat_map(|p| WalkDir::new(p).max_depth(10).into_iter())
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
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
                app_clone.emit("clamscan:log", &line).ok();
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
                app_clone.emit("clamscan:log", &line).ok();
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
        &log_file
    );

    app.emit("clamscan:finished", exit_code).ok();
    Ok(())
}

pub fn get_root_path() -> &'static str {
    if cfg!(windows) {
        "C:\\"
    } else {
        "/"
    }
}

pub fn get_main_scan_paths() -> Vec<PathBuf> {
    let mut paths = Vec::new();
    if let Some(home) = std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }) {
        let home = PathBuf::from(home);
        paths.extend([
            home.join("Downloads"),
            home.join("Desktop"),
            home.join("Documents"),
        ]);
    }
    paths
}

pub fn run_headless_scan(startup: StartupScan) -> Result<(),String> {
    let scan_type = match startup.scan_type {
        Some(s) => s,
        None => return Ok(()),
    };
    let clamscan = resolve_command("clamscan")?;
    let mut cmd = silent_command(clamscan.to_str().unwrap());

    match scan_type {
        ScanType::Main => {
            cmd.args([
                "--recursive",
                "--heuristic-alerts",
                "--alert-encrypted",
                "--max-filesize=100M",
                "--max-scansize=400M",
            ]);
            for path in get_main_scan_paths() {
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

    let status = cmd
        .stdin(Stdio::null())
        .status()
        .map_err(|e|e.to_string())?;
    match status.code() {
        Some(0) => Ok(()),
        Some(1) => Ok(()),
        Some(2) => Err("ClamAV scan error".into()),
        _ => Err("Scan failed".into()),
    }
}