use specta::specta;
use std::path::PathBuf;
use tauri::{Emitter, Manager, command};

use crate::{
    helpers::{
        history::append_scan_history,
        log::{initialize_log_with_id, log_err},
        new_id, resolve_command,
        scan::{SCAN_PROCESS, estimate_total_files, get_main_paths, get_root_path, run_scan},
        silent_command,
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
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
    let log_file = log.file;
    let paths = get_main_paths(app.path());
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The main scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(ScanType::Main),
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );

    std::thread::spawn(move || {
        let clamscan = match resolve_command("clamscan") {
            Ok(cmd) => cmd,
            Err(e) => return Err(format!("Failed to resolve command: {}", e)),
        };
        let mut cmd = silent_command(clamscan.to_str().unwrap());
        cmd.args([
            "--recursive",
            "--heuristic-alerts",
            "--alert-encrypted",
            "--max-filesize=100M",
            "--max-scansize=400M",
            "--verbose",
            "--no-summary",
        ]);
        let total_files = estimate_total_files(&paths);
        app.emit("clamscan:total", total_files)
            .map_err(|e| e.to_string())?;
        for path in paths {
            cmd.arg(path);
        }
        if let Err(e) = run_scan(app.clone(), log_id, cmd, ScanType::Main) {
            app.emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string())?;
            log_err(&log_file, &e.to_string());
            Err(e.to_string())
        } else {
            Ok(())
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
    let log_file = log.file;
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The full scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(ScanType::Full),
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );
    std::thread::spawn(move || {
        let root = get_root_path();
        let clamscan = match resolve_command("clamscan") {
            Ok(cmd) => cmd,
            Err(e) => return Err(format!("Failed to resolve command: {}", e)),
        };
        let mut cmd = silent_command(clamscan.to_str().unwrap());
        cmd.args([
            "--recursive",
            "--cross-fs=yes",
            "--heuristic-alerts",
            "--alert-encrypted",
            "--no-summary",
            root,
        ]);
        if let Err(e) = run_scan(app.clone(), log_id, cmd, ScanType::Full) {
            app.emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string())?;
            log_err(&log_file, &e.to_string());
            Err(e.to_string())
        } else {
            Ok(())
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_custom_scan(app: tauri::AppHandle, paths: Vec<String>) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No scan targets provided".into());
    }
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
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
        &log_file,
    );
    let clamscan = resolve_command("clamscan")?;
    let app_clone = app.clone();
    std::thread::spawn(move || {
        let mut cmd = silent_command(clamscan.to_str().unwrap());
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
        let _ = app_clone
            .emit("clamscan:total", total_files)
            .map_err(|e| e.to_string());
        if let Err(e) = run_scan(app_clone.clone(), log_id.clone(), cmd, scan_type) {
            let _ = app_clone
                .emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string());
            log_err(&log_file, &e.to_string());
        }
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
            let cmd = resolve_command("taskkill")?;
            silent_command(cmd.to_str().unwrap())
                .args(["/PID", &pid.to_string(), "/F"])
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        #[cfg(unix)]
        {
            let cmd = resolve_command("kill")?;
            silent_command(cmd.to_str().unwrap())
                .arg("-9")
                .arg(pid.to_string())
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    } else {
        Err("No scan is currently running".into())
    }
}
