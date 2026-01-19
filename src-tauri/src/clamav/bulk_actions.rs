use specta::specta;
use tauri::command;

use crate::{quarantine_file, restore_quarantine,delete_quarantine};

#[command]
#[specta(result)]
pub fn quarantine_all(
    app: tauri::AppHandle,
    files: Vec<(String, String)>, // (file_path, threat_name)
) -> Result<(), String> {
    for (file_path, threat_name) in files {
        quarantine_file(app.clone(), file_path, threat_name).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_all(files: Vec<String>) -> Result<(), String> {
    for path in files {
        std::fs::remove_file(path).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn restore_all(
    app: tauri::AppHandle,
    ids: Vec<String>
) -> Result<(), String>{
    for id in ids {
        restore_quarantine(app.clone(), id).ok();
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn clear_quarantine(
    app: tauri::AppHandle,
    ids: Vec<String>
) -> Result<(), String>{
    for id in ids {
        delete_quarantine(app.clone(), id).ok();
    }
    Ok(())
}