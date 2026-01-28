pub mod windows;
use std::path::PathBuf;

use crate::types::structs::SchedulerFile;

pub fn load_scheduler_file(path: &PathBuf) -> Result<SchedulerFile, String> {
    if path.exists() {
        let data = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        serde_json::from_str(&data).map_err(|e| format!("Failed to parse scheduler file: {}", e))
    } else {
        Ok(SchedulerFile {
            version: 1,
            schedulers: Vec::new(),
        })
    }
}

pub fn save_scheduler_file(path: &PathBuf, file: &SchedulerFile) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let tmp = path.with_extension("tmp");
    let json = serde_json::to_string_pretty(file).map_err(|e| e.to_string())?;
    std::fs::write(&tmp, json).map_err(|e| e.to_string())?;
    std::fs::rename(&tmp, path).map_err(|e| e.to_string())?;
    Ok(())
}