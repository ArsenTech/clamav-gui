use specta::specta;
use std::path::PathBuf;
use tauri::{command, Emitter};

use crate::{
    helpers::{
        new_id,
        scan::{SCAN_PROCESS, append_scan_history, estimate_total_files, run_scan}, silent_command,

    }, types::{
        enums::{HistoryStatus, LogCategory, ScanType},
        structs::HistoryItem
    }
};

#[command]
#[specta(result)]
pub fn start_main_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    println!("Starting Main Scan...");
    
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
            scan_result: None
        },
    );
    
    std::thread::spawn(move || {
        let mut paths = Vec::new();

        if let Some(home) = std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }) {
            let home = PathBuf::from(home);
            paths.extend([
                home.join("Downloads"),
                home.join("Desktop"),
                home.join("Documents"),
            ]);
        }

        let mut cmd = silent_command("clamscan");
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
        app.emit("clamscan:total", total_files).ok();

        for path in paths {
            cmd.arg(path);
        }
        
        run_scan(app, log_id, cmd, ScanType::Main).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    
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
            scan_result: None
        },
    );
    
    println!("Starting Full Scan...");
    std::thread::spawn(move || {
        let root = if cfg!(windows) { "C:\\" } else { "/" };

        let mut cmd = silent_command("clamscan");
        cmd.args([
            "--recursive",
            "--cross-fs=yes",
            "--heuristic-alerts",
            "--alert-encrypted",
            "--no-summary",
            root,
        ]);
        run_scan(app, log_id, cmd, ScanType::Full).ok();
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
    let scan_type = if has_directory { ScanType::Custom } else { ScanType::File };
    
    println!("Starting Custom Scan...");
    
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
            scan_result: None
        },
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
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        #[cfg(unix)]
        {
            silent_command("kill")
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