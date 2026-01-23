pub mod sysinfo;
pub mod logs;

use specta::specta;
use tauri::command;
use std::process::Stdio;

use crate::{
    helpers::{
        history::append_history,
        log::{initialize_log_with_id, log_err, log_info},
        new_id, silent_command
    }, types::{
        enums::{HistoryStatus, LogCategory},
        structs::HistoryItem
    }
};

#[command]
#[specta(result)]
pub fn remove_file(app: tauri::AppHandle, file_path: String, log_id: Option<String>) -> Result<(), String> {
    if file_path.trim().is_empty() {
        return Err("File path cannot be empty".into());
    }

    let log_id = log_id.unwrap_or_else(new_id);
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();

    match std::fs::remove_file(&file_path) {
        Ok(_) => {
            let message = format!("The file was deleted: {}", file_path);
            log_info(&log_file, &message);
            
            if let Err(e) = append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: "File Deleted".into(),
                    details: message,
                    status: HistoryStatus::Success,
                    log_id: Some(log_id),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None
                },
            ) {
                log_err(&log_file, &format!("Failed to append history: {}", e));
            }
            Ok(())
        }
        Err(e) => {
            let error_msg = format!("Failed to delete file: {} ({})", file_path, e);
            log_err(&log_file, &format!("Failed to delete file: {}", file_path));
            log_err(&log_file, &e.to_string());
            
            if let Err(hist_err) = append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: "File Deletion Failed".into(),
                    details: error_msg.clone(),
                    status: HistoryStatus::Error,
                    log_id: Some(log_id),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None
                },
            ) {
                log_err(&log_file, &format!("Failed to append history: {}", hist_err));
            }
            Err(e.to_string())
        }
    }
}

#[command]
#[specta]
pub fn check_availability() -> bool {
    let command = if cfg!(windows) { "where" } else { "which" };
    silent_command(command)
        .arg("clamscan")
        .stdout(Stdio::null())
        .stderr(Stdio::null());
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}