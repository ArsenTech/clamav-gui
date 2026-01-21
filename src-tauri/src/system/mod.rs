pub mod sysinfo;

use specta::specta;
use tauri::command;

use crate::antivirus::history::{append_history, HistoryItem};

pub fn new_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

#[command]
#[specta(result)]
pub fn remove_file(app: tauri::AppHandle, file_path: String) -> Result<(), String> {
    match std::fs::remove_file(&file_path) {
        Ok(_) => {
            append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: "File Deleted".into(),
                    details: format!("The file was deleted: {}", file_path),
                    status: "success".into(),
                    log_id: None,
                },
            )
            .ok();

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
                    status: "error".into(),
                    log_id: None,
                },
            )
            .ok();

            return Err(e.to_string());
        }
    }
}