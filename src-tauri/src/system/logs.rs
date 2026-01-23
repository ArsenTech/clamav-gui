use specta::specta;
use tauri::{command, Manager};
use tauri_plugin_opener::OpenerExt;

use crate::types::enums::LogCategory;

#[command]
#[specta(result)]
pub fn read_log(
    app: tauri::AppHandle,
    category: LogCategory,
    id: String,
) -> Result<String, String> {
    if id.trim().is_empty() {
        return Err("Log ID cannot be empty".into());
    }

    let mut path = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    path.push("logs");
    path.push(category.as_str());
    path.push(format!("{}.log", id));

    if !path.try_exists().unwrap_or(false) {
        return Err("Log file not found".into());
    }

    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[command]
#[specta(result)]
pub fn reveal_log(app: tauri::AppHandle, category: LogCategory, id: String) -> Result<(), String> {
     if id.trim().is_empty() {
          return Err("Log ID cannot be empty".into());
     }

     let mut path = app.path().app_data_dir().map_err(|e| e.to_string())?;
     path.push("logs");
     path.push(category.as_str());
     path.push(format!("{}.log", id));

     if !path.try_exists().unwrap_or(false) {
          return Err("Log file not found".into());
     }

     app.opener()
          .open_path(path.to_string_lossy(), None::<&str>)
          .map_err(|e| e.to_string())
}