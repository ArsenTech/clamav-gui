use specta::specta;
use std::path::PathBuf;
use std::process::Stdio;
use tauri::{command, Emitter};

use crate::{
    helpers::{
        history::append_scan_history, log::initialize_log_with_id, new_id, scan::{SCAN_PROCESS, estimate_total_files, run_scan}, scan_types::{run_full_scan, run_main_scan}, silent_command
    },
    types::{
        enums::{HistoryStatus, LogCategory, ScanType},
        structs::{HistoryItem, StartupScan},
    },
};

#[command]
#[specta]
pub fn get_startup_scan(state: tauri::State<StartupScan>) -> StartupScan {
    state.inner().clone()
}

#[command]
#[specta(result)]
pub fn start_main_scan(app: tauri::AppHandle) -> Result<(), String> {
    run_main_scan(app)
}

#[command]
#[specta(result)]
pub fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    run_full_scan(app)
}

#[command]
#[specta(result)]
pub fn start_custom_scan(app: tauri::AppHandle, paths: Vec<String>) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No scan targets provided".into());
    }
    let log_id = new_id();
    let log = initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e|e.to_string())?;
    let log_file = log.file;
    let resolved_paths: Vec<PathBuf> = paths.iter().map(PathBuf::from).collect();
    for path in &resolved_paths {
        if !path.try_exists().unwrap_or(false) {
            return Err(format!("Path does not exist: {}", path.display()));
        }
        if !path.is_file() && !path.is_dir() {
            return Err(format!("Invalid scan target: {}", path.display()));
        }
    }

    let has_directory = resolved_paths.iter().any(|p| p.is_dir());
    let scan_type = if has_directory {
        ScanType::Custom
    } else {
        ScanType::File
    };
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The custom scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(scan_type),
            threat_count: None,
            scan_result: None,
        },
        &log_file
    );
    let app_clone = app.clone();
    std::thread::spawn(move || {
        let mut cmd = silent_command("clamscan");
        if has_directory {
            cmd.arg("--recursive");
        }
        cmd.args([
            "--heuristic-alerts",
            "--alert-encrypted",
            "--max-filesize=100M",
            "--max-scansize=400M",
            "--verbose",
            "--no-summary",
        ]);
        for path in &resolved_paths {
            cmd.arg(path);
        }
        let total_files = estimate_total_files(&resolved_paths);
        app_clone.emit("clamscan:total", total_files).ok();
        run_scan(app_clone, log_id, cmd, scan_type).ok();
    });
    Ok(())
}

#[command]
#[specta(result)]
pub fn stop_scan() -> Result<(), String> {
    let pid = {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        guard.take()
    };
    if let Some(pid) = pid {
        #[cfg(windows)]
        {
            silent_command("taskkill")
                .args(["/PID", &pid.to_string(), "/F"])
                .stdin(Stdio::null())
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        #[cfg(unix)]
        {
            silent_command("kill")
                .arg("-9")
                .arg(pid.to_string())
                .stdin(Stdio::null())
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    } else {
        Err("No scan is currently running".into())
    }
}
