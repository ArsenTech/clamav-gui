use serde::{Deserialize, Serialize};
use specta::{specta, Type};
use std::path::PathBuf;
use tauri::command;
use tauri::Manager;

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct HistoryItem {
    pub id: String,
    pub timestamp: String,
    pub action: String,
    pub details: String,
    pub status: String,
    pub log_id: Option<String>,
}

fn history_dir(app: &tauri::AppHandle) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("history");
    std::fs::create_dir_all(&dir).ok();
    dir
}

pub fn append_history(app: &tauri::AppHandle, item: HistoryItem) -> Result<(), String> {
    let dir = history_dir(app);
    let date = chrono::Utc::now().format("%Y-%m-%d").to_string();
    let file = dir.join(format!("{}.json", date));

    let mut items: Vec<HistoryItem> = if file.exists() {
        serde_json::from_str(&std::fs::read_to_string(&file).unwrap_or("[]".into()))
            .unwrap_or_default()
    } else {
        vec![]
    };

    items.push(item);

    std::fs::write(file, serde_json::to_string_pretty(&items).unwrap())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
#[specta(result)]
pub fn load_history(app: tauri::AppHandle, days: u32) -> Result<Vec<HistoryItem>, String> {
    let dir = history_dir(&app);
    let mut all = Vec::new();

    for i in 0..days {
        let date = chrono::Utc::now() - chrono::Duration::days(i as i64);
        let path = dir.join(format!("{}.json", date.format("%Y-%m-%d")));
        if path.exists() {
            let content = std::fs::read_to_string(path).unwrap();
            let mut items: Vec<HistoryItem> = serde_json::from_str(&content).unwrap_or_default();
            all.append(&mut items);
        }
    }

    all.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    Ok(all)
}

#[command]
#[specta(result)]
pub fn mark_as_acknowledged(app: tauri::AppHandle, id: String, date: String) -> Result<(),String> {
    let dir = history_dir(&app);
    let file_path = dir.join(format!("{}.json", date));

    if !file_path.exists() {
        return Err("History date file not found".into());
    }

    let mut items: Vec<HistoryItem> = serde_json::from_str(
        &std::fs::read_to_string(&file_path).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    let mut found = false;

    for item in &mut items {
        if item.id == id {
            if item.status != "acknowledged" {
                item.status = "acknowledged".into();
            }
            found = true;
            break;
        }
    }

    if !found {
        return Err("History item not found".into());
    }

    std::fs::write(
        &file_path,
        serde_json::to_string_pretty(&items).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
#[specta(result)]
pub fn clear_history(app: tauri::AppHandle) -> Result<(),String> {
    let dir = history_dir(&app);
    if !dir.exists() {
        return Ok(());
    }
    for entry in std::fs::read_dir(&dir).map_err(|e| e.to_string())?{
        let path = entry.map_err(|e| e.to_string())?.path();

        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            std::fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}