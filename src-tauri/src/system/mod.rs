pub mod logs;
pub mod scheduler;
pub mod sysinfo;

use specta::specta;
use tauri::command;
use tauri::Manager;
use tauri::image::Image;

use crate::{
    helpers::{
        history::append_history, i18n::{TRANSLATIONS, load_translations}, log::{initialize_log_with_id, log_err, log_info}, new_id, path::get_clamav_path, sys_tray::generate_system_tray
    },
    types::{
        enums::{HistoryDetails, HistoryStatus, HistoryType, LogCategory, RealTimeState},
        structs::{AppLanguage, HistoryItem},
    },
};

#[command]
#[specta(result)]
pub fn remove_file(
    app: tauri::AppHandle,
    file_path: String,
    log_id: Option<String>,
) -> Result<(), String> {
    if file_path.trim().is_empty() {
        return Err("File path cannot be empty".into());
    }

    let log_id = log_id.unwrap_or_else(new_id);
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();

    match std::fs::remove_file(&file_path) {
        Ok(_) => {
            let message = format!("The file was deleted: {}", file_path);
            log_info(&log_file, &message);

            if let Err(e) = append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: Some(HistoryType::FileDelete),
                    details: Some(HistoryDetails::FileDelete { file_path }),
                    status: HistoryStatus::Success,
                    log_id: Some(log_id),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None,
                },
            ) {
                log_err(&log_file, &format!("Failed to append history: {}", e));
            }
            Ok(())
        }
        Err(e) => {
            let error_msg = format!("Failed to delete file: {} ({})", file_path, e);
            log_err(&log_file, &format!("Failed to delete file: {}", file_path));
            log_err(&log_file, &e.to_string());

            if let Err(e) = append_history(
                &app,
                HistoryItem {
                    id: new_id(),
                    timestamp: chrono::Utc::now().to_rfc3339(),
                    action: Some(HistoryType::FileDeleteError),
                    details: Some(HistoryDetails::FileDeleteError { err: error_msg.clone(), file_path }),
                    status: HistoryStatus::Error,
                    log_id: Some(log_id),
                    category: Some(LogCategory::Quarantine),
                    scan_type: None,
                    threat_count: None,
                    scan_result: None,
                },
            ) {
                log_err(&log_file, &format!("Failed to append history: {}", e));
            }
            Err(e.to_string())
        }
    }
}

#[command]
#[specta]
pub fn check_availability() -> bool {
    get_clamav_path().is_ok()
}

#[command]
#[specta]
pub fn set_language(
    app: tauri::AppHandle,
    state: tauri::State<AppLanguage>,
    lang: String,
) -> Result<(), String> {
    {
        let mut guard = state.0.lock().unwrap();
        *guard = lang.clone();
    }
    let map = load_translations(&app,&lang);
    let mut translations = TRANSLATIONS
        .write()
        .map_err(|_| "Translation lock poisoned")?;
    *translations = map;
    Ok(())
}

#[command]
#[specta(result)]
pub fn rebuild_tray(app: tauri::AppHandle) -> Result<(), String> {
    app.remove_tray_by_id("main_tray");
    generate_system_tray(&app).map_err(|e|e.to_string())?;
    Ok(())
}

#[command]
#[specta(result)]
pub fn update_tray_icon(app: tauri::AppHandle, state: RealTimeState) -> Result<(),String> {
    let path = app.path();
    let icon_path = match state{
        RealTimeState::Enabled => path.resolve("icons/green.png", tauri::path::BaseDirectory::Resource)
            .expect("Failed to load the icon"),
        RealTimeState::Disabled => path.resolve("icons/red.png", tauri::path::BaseDirectory::Resource)
            .expect("Failed to load the icon"),
        _ => path.resolve("icons/blue.png", tauri::path::BaseDirectory::Resource)
            .expect("Failed to load the icon"),
    };
    let icon = Image::from_path(icon_path).map_err(|e|e.to_string())?;
    if let Some(tray) = app.tray_by_id("main_tray"){
        tray.set_icon(Some(icon)).map_err(|e|e.to_string())?
    }
    Ok(())
}