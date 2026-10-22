use specta::specta;
use tauri::command;

use crate::{
    delete_quarantine,
    helpers::new_id,
    quarantine_file,
    remove_file,
    restore_quarantine,
    system::backend_errors::{self}
};

#[command]
#[specta(result)]
pub fn quarantine_all(
    app: tauri::AppHandle,
    files: Vec<(String, String)>, // (file_path, threat_name)
) -> Result<(), String> {
    if files.is_empty() {
        return Err(backend_errors::NO_FILES_QUARANTINE.into());
    }

    let log_id = new_id();
    let mut successes = 0;
    let mut failures = 0;

    for (file_path, threat_name) in files {
        match quarantine_file(app.clone(), file_path, threat_name, Some(log_id.clone())) {
            Ok(_) => successes += 1,
            Err(_) => failures += 1,
        }
    }
    if successes == 0 && failures > 0 {
        return Err(serde_json::json!({
            "code": backend_errors::BULK_QUARANTINE_FAILED,
            "params": { "count": failures }
        }).to_string());
    }

    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_all(app: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    if files.is_empty() {
        return Err(backend_errors::NO_FILES_DELETION.into());
    }

    let log_id = new_id();
    let mut successes = 0;
    let mut failures = 0;

    for path in files {
        match remove_file(app.clone(), path, Some(log_id.clone())) {
            Ok(_) => successes += 1,
            Err(_) => failures += 1,
        }
    }
    if successes == 0 && failures > 0 {
        return Err(serde_json::json!({
            "code": backend_errors::BULK_DELETE_FAILED,
            "params": { "count": failures }
        }).to_string());
    }

    Ok(())
}

#[command]
#[specta(result)]
pub fn restore_all(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    if ids.is_empty() {
        return Err(backend_errors::NO_IDS_RESTORATION.into());
    }

    let log_id = new_id();
    let mut successes = 0;
    let mut failures = 0;

    for id in ids {
        match restore_quarantine(app.clone(), id, Some(log_id.clone())) {
            Ok(_) => successes += 1,
            Err(_) => failures += 1,
        }
    }
    if successes == 0 && failures > 0 {
        return Err(serde_json::json!({
            "code": backend_errors::BULK_RESTORE_FAILED,
            "params": { "count": failures }
        }).to_string());
    }

    Ok(())
}

#[command]
#[specta(result)]
pub fn clear_quarantine(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    if ids.is_empty() {
        return Err(backend_errors::NO_IDS_CLEARQ.into());
    }

    let log_id = new_id();
    let mut successes = 0;
    let mut failures = 0;

    for id in ids {
        match delete_quarantine(app.clone(), id, Some(log_id.clone())) {
            Ok(_) => successes += 1,
            Err(_) => failures += 1,
        }
    }
    if successes == 0 && failures > 0 {
        return Err(serde_json::json!({
            "code": backend_errors::BULK_CLEAR_FAILED,
            "params": { "count": failures }
        }).to_string());
    }

    Ok(())
}
