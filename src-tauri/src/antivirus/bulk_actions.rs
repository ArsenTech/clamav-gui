use specta::specta;
use tauri::command;

use crate::{
    remove_file,
    restore_quarantine,
    quarantine_file,
    delete_quarantine,
    helpers::new_id
};

#[command]
#[specta(result)]
pub fn quarantine_all(
    app: tauri::AppHandle,
    files: Vec<(String, String)>, // (file_path, threat_name)
) -> Result<(), String> {
    
    if files.is_empty() {
        return Err("No files provided for quarantine".into());
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
        return Err(format!("All {} quarantine operations failed", failures));
    }
    
    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_all(app: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    if files.is_empty() {
        return Err("No files provided for deletion".into());
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
        return Err(format!("All {} deletion operations failed", failures));
    }
    
    Ok(())
}

#[command]
#[specta(result)]
pub fn restore_all(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    if ids.is_empty() {
        return Err("No IDs provided for restoration".into());
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
        return Err(format!("All {} restore operations failed", failures));
    }
    
    Ok(())
}

#[command]
#[specta(result)]
pub fn clear_quarantine(app: tauri::AppHandle, ids: Vec<String>) -> Result<(), String> {
    if ids.is_empty() {
        return Err("No IDs provided for clearing quarantine".into());
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
        return Err(format!("All {} clear operations failed", failures));
    }
    
    Ok(())
}