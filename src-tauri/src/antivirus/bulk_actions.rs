use specta::specta;
use tauri::command;

use crate::system::new_id;
use crate::{delete_quarantine, quarantine_file, remove_file, restore_quarantine};

#[command]
#[specta(result)]
pub fn quarantine_all(
    app: tauri::AppHandle,
    files: Vec<(String, String)>, // (file_path, threat_name)
) -> Result<(), String> {
    let log_id = new_id();
    for (file_path, threat_name) in files {
        quarantine_file(app.clone(), file_path, threat_name, Some(log_id.clone())).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_all(app: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    let log_id = new_id();
    for path in files {
        remove_file(app.clone(), path, Some(log_id.clone())).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn restore_all(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    let log_id = new_id();
    for id in ids {
        restore_quarantine(app.clone(), id, Some(log_id.clone())).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn clear_quarantine(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    let log_id = new_id();
    for id in ids {
        delete_quarantine(app.clone(), id, Some(log_id.clone())).ok();
    }
    Ok(())
}
