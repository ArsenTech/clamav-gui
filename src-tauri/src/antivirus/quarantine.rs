use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use specta::{specta, Type};
use std::collections::HashMap;
use std::io;
use std::path::PathBuf;
use tauri::command;
use tauri::Manager;

use crate::antivirus::history::append_history;
use crate::antivirus::history::HistoryItem;

fn quarantine_id(file_path: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(file_path.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct QuarantinedItem {
    id: String,
    threat_name: String,
    file_path: String,
    quarantined_at: String,
    size: u64,
}

fn quarantine_dir(app: &tauri::AppHandle) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("quarantine");
    std::fs::create_dir_all(&dir).ok();
    dir
}

#[command]
#[specta(result)]
pub fn quarantine_file(
    app: tauri::AppHandle,
    file_path: String,
    threat_name: String,
) -> Result<(), String> {
    let src = PathBuf::from(&file_path);
    if !src.exists() {
        return Err("File no longer exists".into());
    }

    let quarantine = quarantine_dir(&app);
    let id = quarantine_id(&file_path);

    let dest = quarantine.join(format!("{}.quarantine", id));

    if dest.try_exists().unwrap_or(false) {
        return Err("File already quarantined".into());
    }

    if let Err(e) = std::fs::rename(&src, &dest) {
        if e.kind() == io::ErrorKind::CrossesDevices {
            std::fs::copy(&src, &dest).map_err(|e| e.to_string())?;
            std::fs::remove_file(&src).map_err(|e| e.to_string())?;
        } else {
            return Err(e.to_string());
        }
    }

    append_history(
        &app,
        HistoryItem {
            id: crate::system::new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Threat Quarantined".into(),
            details: format!("{} was moved to quarantine", threat_name),
            status: "warning".into(),
            log_id: None,
        },
    )
    .ok();

    let meta = QuarantinedItem {
        id,
        file_path,
        threat_name,
        quarantined_at: chrono::Utc::now().to_rfc3339(),
        size: dest.metadata().map(|m| m.len()).unwrap_or(0),
    };

    let meta_path = quarantine.join(format!("{}.json", meta.id));
    std::fs::write(meta_path, serde_json::to_string(&meta).unwrap()).ok();

    Ok(())
}

#[command]
#[specta(result)]
pub fn list_quarantine(app: tauri::AppHandle) -> Result<Vec<QuarantinedItem>, String> {
    let dir = quarantine_dir(&app);
    let mut map: HashMap<String, QuarantinedItem> = HashMap::new();

    for entry in std::fs::read_dir(dir).map_err(|e| e.to_string())? {
        let path = entry.map_err(|e| e.to_string())?.path();

        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            if let Ok(content) = std::fs::read_to_string(&path) {
                if let Ok(item) = serde_json::from_str::<QuarantinedItem>(&content) {
                    map.insert(item.id.clone(), item);
                }
            }
        }
    }

    let mut items: Vec<_> = map.into_values().collect();
    items.sort_by(|a, b| b.quarantined_at.cmp(&a.quarantined_at));
    Ok(items)
}

#[command]
#[specta(result)]
pub fn restore_quarantine(app: tauri::AppHandle, id: String) -> Result<(), String> {
    let dir = quarantine_dir(&app);
    let meta_path = dir.join(format!("{}.json", id));
    let bin_path = dir.join(format!("{}.quarantine", id));

    let meta: QuarantinedItem =
        serde_json::from_str(&std::fs::read_to_string(&meta_path).map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string())?;

    let dest = PathBuf::from(&meta.file_path);

    if let Some(parent) = dest.parent() {
        std::fs::create_dir_all(parent).ok();
    }

    if dest.try_exists().unwrap_or(false) {
        return Err("Restore destination already exists".into());
    }

    if let Err(e) = std::fs::rename(&bin_path, &dest) {
        if e.kind() == io::ErrorKind::CrossesDevices {
            std::fs::copy(&bin_path, &dest).map_err(|e| e.to_string())?;
            std::fs::remove_file(&bin_path).map_err(|e| e.to_string())?;
        } else {
            return Err(e.to_string());
        }
    }

    append_history(
        &app,
        HistoryItem {
            id: crate::system::new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Threat restored".into(),
            details: format!("{} was restored from quarantine", meta.threat_name),
            status: "success".into(),
            log_id: None,
        },
    )
    .ok();

    std::fs::remove_file(meta_path).ok();

    Ok(())
}

#[command]
#[specta(result)]
pub fn delete_quarantine(app: tauri::AppHandle, id: String) -> Result<(), String> {
    let dir = quarantine_dir(&app);
    let meta_path = dir.join(format!("{}.json", id));
    let bin_path = dir.join(format!("{}.quarantine", id));

    let meta: QuarantinedItem =
        serde_json::from_str(&std::fs::read_to_string(&meta_path).map_err(|e| e.to_string())?)
            .map_err(|e| e.to_string())?;

    if bin_path.exists() {
        std::fs::remove_file(&bin_path).map_err(|e| e.to_string())?;
    }

    if meta_path.exists() {
        std::fs::remove_file(&meta_path).map_err(|e| e.to_string())?;
    }

    append_history(
        &app,
        HistoryItem {
            id: crate::system::new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Threat deleted".into(),
            details: format!("{} was deleted from quarantine", meta.threat_name),
            status: "success".into(),
            log_id: None,
        },
    )
    .ok();

    Ok(())
}
