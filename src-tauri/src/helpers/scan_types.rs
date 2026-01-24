use tauri::Emitter;

use crate::{
    helpers::{
        history::append_scan_history, log::initialize_log_with_id, new_id, scan::{estimate_total_files, get_main_scan_paths, get_root_path, run_scan}, silent_command
    },
    types::{
        enums::{HistoryStatus, LogCategory, ScanType},
        structs::HistoryItem,
    },
};

pub fn run_main_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    let log = initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e|e.to_string())?;
    let log_file = log.file;
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
        &log_file
    );

    std::thread::spawn(move || {
        let paths = get_main_scan_paths();
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

pub fn run_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    let log = initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e|e.to_string())?;
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
        &log_file
    );
    std::thread::spawn(move || {
        let root = get_root_path();
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
