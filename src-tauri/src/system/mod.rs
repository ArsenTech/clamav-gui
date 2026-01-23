pub mod sysinfo;
pub mod logs;

use specta::specta;
use tauri::command;

use crate::types::enums::{HistoryStatus, LogCategory};
use crate::types::structs::HistoryItem;
use crate::{antivirus::history::append_history, system::logs::{initialize_log_with_id, log_err, log_info}};

pub fn new_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

#[command]
#[specta(result)]
pub fn remove_file(app: tauri::AppHandle, file_path: String, log_id: Option<String>) -> Result<(), String> {
    let log_id = match log_id {
        Some(id) => id,
        None => new_id()
    };
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();

    match std::fs::remove_file(&file_path) {
        Ok(_) => {
            append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: "File Deleted".into(),
                    details: format!("The file was deleted: {}", file_path),
                    status: HistoryStatus::Success,
                    log_id: Some(log_id.clone()),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None
                },
            )
            .ok();
            log_info(&log_file, &format!("The file was deleted: {}", file_path));
            return Ok(());
        }
        Err(e) => {
            append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: "File Deletion Failed".into(),
                    details: format!("Failed to delete file: {} ({})", file_path, e),
                    status: HistoryStatus::Error,
                    log_id: Some(log_id.clone()),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None
                },
            )
            .ok();
            log_err(&log_file, &format!("Failed to delete file: {}", file_path));
            log_err(&log_file, &e.to_string());
            return Err(e.to_string());
        }
    }
}