use specta::specta;
use tauri::command;

use crate::{
    helpers::history::history_dir,
    types::{
        enums::HistoryStatus,
        structs::HistoryItem
    }
};

#[command]
#[specta(result)]
pub fn load_history(app: tauri::AppHandle, days: u32) -> Result<Vec<HistoryItem>, String> {
    let dir = history_dir(&app);
    
    let mut all = Vec::with_capacity((days as usize) * 10);

    for i in 0..days {
        let date = chrono::Utc::now() - chrono::Duration::days(i as i64);
        let path = dir.join(format!("{}.json", date.format("%Y-%m-%d")));
        
        if !path.try_exists().unwrap_or(false) {
            continue;
        }
        
        let content = std::fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read history file {:?}: {}", path, e))?;
            
        let mut items: Vec<HistoryItem> = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse history file {:?}: {}", path, e))?;
            
        all.append(&mut items);
    }

    all.sort_unstable_by(|a, b| b.timestamp.cmp(&a.timestamp));
    Ok(all)
}

#[command]
#[specta(result)]
pub fn mark_as_acknowledged(app: tauri::AppHandle, id: String, date: String) -> Result<(), String> {
    if id.trim().is_empty() {
        return Err("ID cannot be empty".into());
    }
    if date.trim().is_empty() {
        return Err("Date cannot be empty".into());
    }

    let dir = history_dir(&app);
    let file_path = dir.join(format!("{}.json", date));

    if !file_path.try_exists().unwrap_or(false) {
        return Err("History date file not found".into());
    }

    let content = std::fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    let mut items: Vec<HistoryItem> = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    let mut found = false;

    for item in &mut items {
        if item.id == id {
            if item.status != HistoryStatus::Acknowledged {
                item.status = HistoryStatus::Acknowledged;
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
pub fn clear_history(app: tauri::AppHandle, mode: String) -> Result<(), String> {
    if mode != "all" && mode != "acknowledged" {
        return Err("Invalid clear history mode. Use 'all' or 'acknowledged'".into());
    }

    let dir = history_dir(&app);
    if !dir.try_exists().unwrap_or(false) {
        return Ok(());
    }
    
    for entry in std::fs::read_dir(&dir).map_err(|e| e.to_string())? {
        let path = entry.map_err(|e| e.to_string())?.path();
        
        if path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }
        
        match mode.as_str() {
            "all" => {
                std::fs::remove_file(&path).map_err(|e| e.to_string())?;
            }
            "acknowledged" => {
                let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
                let mut items: Vec<HistoryItem> =
                    serde_json::from_str(&content).map_err(|e| e.to_string())?;

                items.retain(|i| i.status != HistoryStatus::Acknowledged);

                if items.is_empty() {
                    std::fs::remove_file(&path).map_err(|e| e.to_string())?;
                } else {
                    std::fs::write(
                        &path,
                        serde_json::to_string_pretty(&items).map_err(|e| e.to_string())?
                    ).map_err(|e| e.to_string())?;
                }
            }
            _ => unreachable!(),
        }
    }
    Ok(())
}