use std::io::Write;
use std::{
    fs::{File, OpenOptions},
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::Manager;

use crate::{
    helpers::new_id,
    types::{enums::LogCategory, structs::InitLog},
};

pub fn log_path(app: &tauri::AppHandle, log_dir: LogCategory, log_id: &str) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("logs");
    dir.push(log_dir.as_str());
    std::fs::create_dir_all(&dir).ok();
    dir.join(format!("{}.log", log_id))
}

fn open_log_file(path: &PathBuf) -> Result<Arc<Mutex<File>>, String> {
    let file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| e.to_string())?;
    Ok(Arc::new(Mutex::new(file)))
}

pub fn initialize_log(app: &tauri::AppHandle, category: LogCategory) -> Result<InitLog, String> {
    let log_id = new_id();
    let log_path = log_path(app, category, &log_id);
    let file = open_log_file(&log_path)?;

    Ok(InitLog { id: log_id, file })
}

pub fn initialize_log_with_id(
    app: &tauri::AppHandle,
    category: LogCategory,
    log_id: &str,
) -> Result<InitLog, String> {
    let log_path = log_path(app, category, log_id);
    let file = open_log_file(&log_path)?;

    Ok(InitLog {
        id: log_id.to_string(),
        file,
    })
}

pub fn log_err(log: &Arc<Mutex<File>>, msg: &str) {
    if let Ok(mut f) = log.lock() {
        writeln!(f, "[{}] [ERROR] {}", chrono::Utc::now().to_rfc3339(), msg).ok();
    }
}

pub fn log_info(log: &Arc<Mutex<File>>, msg: &str) {
    if let Ok(mut f) = log.lock() {
        writeln!(f, "[{}] {}", chrono::Utc::now().to_rfc3339(), msg).ok();
    }
}
