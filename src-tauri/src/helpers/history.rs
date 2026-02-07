use std::{
    fs::File,
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::Manager;

use crate::{helpers::log::log_err, types::structs::HistoryItem};

pub fn history_dir(app: &tauri::AppHandle) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("history");
    if let Err(e) = std::fs::create_dir_all(&dir) {
        eprintln!("[ERROR]: {}", e.to_string())
    }
    dir
}

pub fn append_history(app: &tauri::AppHandle, item: HistoryItem) -> Result<(), String> {
    let dir = history_dir(app);
    let date = chrono::Utc::now().format("%Y-%m-%d").to_string();
    let file = dir.join(format!("{}.json", date));

    let mut items: Vec<HistoryItem> = if file.try_exists().unwrap_or(false) {
        match std::fs::read_to_string(&file) {
            Ok(content) => serde_json::from_str(&content).unwrap_or_else(|_| vec![]),
            Err(_) => vec![],
        }
    } else {
        vec![]
    };

    items.push(item);

    std::fs::write(file, serde_json::to_string_pretty(&items).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn append_update_history(app: &tauri::AppHandle, item: HistoryItem, log: &Arc<Mutex<File>>) {
    if let Err(e) = append_history(app, item) {
        log_err(log, &format!("Failed to append update history: {}", e));
    }
}

pub fn append_scan_history(app: &tauri::AppHandle, item: HistoryItem, log: &Arc<Mutex<File>>) {
    if let Err(e) = append_history(app, item) {
        log_err(log, &format!("Scan history append failed: {}", e));
    }
}

pub fn append_scheduler_history(
    app: &tauri::AppHandle,
    item: HistoryItem,
    log_file: &std::sync::Arc<std::sync::Mutex<std::fs::File>>,
) {
    if let Err(e) = append_history(app, item) {
        log_err(log_file, &format!("Failed to append history: {}", e));
    }
}

pub fn append_realtime_history(
    app: &tauri::AppHandle,
    item: HistoryItem,
    log_file: &std::sync::Arc<std::sync::Mutex<std::fs::File>>,
) {
    if let Err(e) = append_history(app, item) {
        log_err(
            log_file,
            &format!("Failed to append real-time scan history: {}", e),
        );
    }
}

pub fn clear_by_status(
    path: &std::path::PathBuf,
    retain_predicate: impl Fn(&HistoryItem) -> bool,
) -> Result<(), String> {
    let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
    let mut items: Vec<HistoryItem> = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    items.retain(retain_predicate);

    if items.is_empty() {
        std::fs::remove_file(path).map_err(|e| e.to_string())?;
    } else {
        std::fs::write(
            path,
            serde_json::to_string_pretty(&items).map_err(|e| e.to_string())?,
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}