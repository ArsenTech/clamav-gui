use specta::specta;
use std::{collections::HashMap, path::PathBuf};
use tauri::command;

use crate::{
    helpers::{
        history::append_history,
        log::{initialize_log_with_id, log_err, log_info},
        new_id,
        quarantine::{move_file_cross_device, quarantine_dir, quarantine_id},
    },
    types::{
        enums::{HistoryStatus, LogCategory, HistoryType},
        structs::{HistoryItem, QuarantinedItem},
    },
};

#[command]
#[specta(result)]
pub fn quarantine_file(
    app: tauri::AppHandle,
    file_path: String,
    threat_name: String,
    log_id: Option<String>,
) -> Result<(), String> {
    if file_path.trim().is_empty() {
        return Err("File path cannot be empty".into());
    }
    if threat_name.trim().is_empty() {
        return Err("Threat name cannot be empty".into());
    }

    let log_id = log_id.unwrap_or_else(new_id);
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();
    let src = PathBuf::from(&file_path);
    if !src.try_exists().unwrap_or(false) {
        log_err(&log_file, "File no longer exists");
        return Err("File no longer exists".into());
    }

    let quarantine = quarantine_dir(&app);
    let id = quarantine_id();
    let dest = quarantine.join(format!("{}.quarantine", id));
    if dest.try_exists().unwrap_or(false) {
        log_err(&log_file, "File already quarantined");
        return Err("File already quarantined".into());
    }
    if let Err(e) = move_file_cross_device(&src, &dest) {
        log_err(&log_file, &e.to_string());
        return Err(e.to_string());
    }

    log_info(
        &log_file,
        &format!("{} ({}) was moved to quarantine", threat_name, file_path),
    );

    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: Some(HistoryType::QuarantineThreat),
            details: format!("{} was moved to quarantine", threat_name),
            status: HistoryStatus::Warning,
            category: Some(LogCategory::Quarantine),
            log_id: Some(log_id.clone()),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
    ) {
        log_err(&log_file, &format!("Failed to append history: {}", e));
    }
    let size = dest.metadata().map(|m| m.len()).unwrap_or(0);
    let meta = QuarantinedItem {
        id,
        file_path,
        threat_name,
        quarantined_at: chrono::Utc::now().to_rfc3339(),
        size,
    };
    let meta_path = quarantine.join(format!("{}.json", meta.id));
    if let Err(e) = std::fs::write(&meta_path, serde_json::to_string(&meta).unwrap()) {
        log_err(&log_file, &format!("Failed to write metadata: {}", e));
    }
    Ok(())
}

#[command]
#[specta(result)]
pub fn list_quarantine(app: tauri::AppHandle) -> Result<Vec<QuarantinedItem>, String> {
    let dir = quarantine_dir(&app);
    let mut map: HashMap<String, QuarantinedItem> = HashMap::new();

    let entries = std::fs::read_dir(&dir).map_err(|e| e.to_string())?;

    for entry in entries {
        let path = entry.map_err(|e| e.to_string())?.path();
        if path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }
        if let Ok(content) = std::fs::read_to_string(&path) {
            if let Ok(item) = serde_json::from_str::<QuarantinedItem>(&content) {
                map.insert(item.id.clone(), item);
            }
        }
    }

    let mut items: Vec<_> = map.into_values().collect();
    items.sort_unstable_by(|a, b| b.quarantined_at.cmp(&a.quarantined_at));
    Ok(items)
}

#[command]
#[specta(result)]
pub fn restore_quarantine(
    app: tauri::AppHandle,
    id: String,
    log_id: Option<String>,
) -> Result<(), String> {
    if id.trim().is_empty() {
        return Err("ID cannot be empty".into());
    }

    let log_id = log_id.unwrap_or_else(new_id);
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();

    let dir = quarantine_dir(&app);
    let meta_path = dir.join(format!("{}.json", id));
    let bin_path = dir.join(format!("{}.quarantine", id));

    let meta: QuarantinedItem =
        serde_json::from_str(&std::fs::read_to_string(&meta_path).map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string())?;

    let dest = PathBuf::from(&meta.file_path);

    if let Some(parent) = dest.parent() {
        if let Err(e) = std::fs::create_dir_all(parent) {
            log_err(
                &log_file,
                &format!("Failed to create parent directory: {}", e),
            );
            return Err(format!("Failed to create parent directory: {}", e));
        }
    }
    if dest.try_exists().unwrap_or(false) {
        log_err(&log_file, "Restore destination already exists");
        return Err("Restore destination already exists".into());
    }
    if let Err(e) = move_file_cross_device(&bin_path, &dest) {
        log_err(&log_file, &e.to_string());
        return Err(e.to_string());
    }

    log_info(
        &log_file,
        &format!(
            "{} ({}) was restored from quarantine",
            meta.threat_name, meta.file_path
        ),
    );

    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: Some(HistoryType::RestoreThreat),
            details: format!("{} was restored from quarantine", meta.threat_name),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Quarantine),
            log_id: Some(log_id.clone()),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
    ) {
        log_err(&log_file, &format!("Failed to append history: {}", e));
    }
    if let Err(e) = std::fs::remove_file(&meta_path) {
        log_err(&log_file, &format!("Failed to remove metadata file: {}", e));
    }

    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_quarantine(
    app: tauri::AppHandle,
    id: String,
    log_id: Option<String>,
) -> Result<(), String> {
    if id.trim().is_empty() {
        return Err("ID cannot be empty".into());
    }

    let log_id = log_id.unwrap_or_else(new_id);
    let init = initialize_log_with_id(&app, LogCategory::Quarantine, &log_id)?;
    let log_file = init.file.clone();

    let dir = quarantine_dir(&app);
    let meta_path_name = format!("{}.json", id);
    let bin_path_name = format!("{}.quarantine", id);
    let meta_path = dir.join(&meta_path_name);
    let bin_path = dir.join(&bin_path_name);

    let meta: QuarantinedItem =
        serde_json::from_str(&std::fs::read_to_string(&meta_path).map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string())?;

    if bin_path.try_exists().unwrap_or(false) {
        std::fs::remove_file(&bin_path).map_err(|e| e.to_string())?;
        log_info(
            &log_file,
            &format!("Deleted the binary path: {}", bin_path_name),
        );
    }
    if meta_path.try_exists().unwrap_or(false) {
        std::fs::remove_file(&meta_path).map_err(|e| e.to_string())?;
        log_info(
            &log_file,
            &format!("Deleted the metadata path: {}", meta_path_name),
        );
    }

    log_info(
        &log_file,
        &format!("{} was deleted from quarantine", meta.threat_name),
    );

    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: Some(HistoryType::DeleteThreat),
            details: format!("{} was deleted from quarantine", meta.threat_name),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Quarantine),
            log_id: Some(log_id.clone()),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
    ) {
        log_err(&log_file, &format!("Failed to append history: {}", e));
    }

    Ok(())
}
