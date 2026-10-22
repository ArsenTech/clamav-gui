use specta::specta;
use tauri::{command, Manager};
use tauri_plugin_opener::OpenerExt;

use crate::{
    types::enums::history::LogCategory,
    system::backend_errors::{self}
};

#[command]
#[specta(result)]
pub fn read_log(
    app: tauri::AppHandle,
    category: LogCategory,
    id: String,
) -> Result<String, String> {
    if id.trim().is_empty() {
        return Err(backend_errors::LOG_ID_EMPTY.into());
    }

    let mut path = app.path().app_data_dir().map_err(|e| e.to_string())?;

    path.push("logs");
    path.push(category.as_str());
    path.push(format!("{}.log", id));

    if !path.try_exists().unwrap_or(false) {
        return Err(backend_errors::NO_LOG_FILE.into());
    }

    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[command]
#[specta(result)]
pub fn reveal_log(app: tauri::AppHandle, category: LogCategory, id: String) -> Result<(), String> {
    if id.trim().is_empty() {
        return Err(backend_errors::LOG_ID_EMPTY.into());
    }

    let mut path = app.path().app_data_dir().map_err(|e| e.to_string())?;
    path.push("logs");
    path.push(category.as_str());
    path.push(format!("{}.log", id));

    if !path.try_exists().unwrap_or(false) {
        return Err(backend_errors::NO_LOG_FILE.into());
    }

    app.opener()
        .open_path(path.to_string_lossy(), None::<&str>)
        .map_err(|e| e.to_string())
}
