use std::{fs::File, path::PathBuf, sync::{Arc, Mutex}};
use tauri::Manager;

use crate::{helpers::log::log_err, types::structs::HistoryItem};

pub fn history_dir(app: &tauri::AppHandle) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("history");
    std::fs::create_dir_all(&dir).ok();
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