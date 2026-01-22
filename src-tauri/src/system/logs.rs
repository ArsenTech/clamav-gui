use serde::{Serialize, Deserialize};
use specta::{Type, specta};
use std::{fs::{File, OpenOptions}, path::PathBuf, sync::{Arc, Mutex}};
use tauri::{command, Manager};
use std::io::Write;
use tauri_plugin_opener::OpenerExt;

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy)]
#[serde(rename_all = "lowercase")]
pub enum LogCategory {
    Scan,
    Update,
    Quarantine,
    Realtime,
    Scheduler,
}

pub struct InitLog {
     pub id: String,
     pub file: Arc<Mutex<File>>
}

impl LogCategory {
     fn as_str(&self) -> &'static str {
          match self {
               LogCategory::Scan => "scan",
               LogCategory::Update => "update",
               LogCategory::Quarantine => "quarantine",
               LogCategory::Realtime => "realtime",
               LogCategory::Scheduler => "scheduler",
          }
     }
}

pub fn log_path(app: &tauri::AppHandle, log_dir: LogCategory, log_id: &str) -> PathBuf {
     let mut dir = app.path().app_data_dir().unwrap();
     dir.push("logs");
     dir.push(log_dir.as_str());
     std::fs::create_dir_all(&dir).ok();
     dir.join(format!("{}.log", log_id))
}

pub fn initialize_log(
     app: &tauri::AppHandle,
     category: LogCategory,
) -> Result<InitLog, String> {
     let log_id = crate::system::new_id();
     let log_path = log_path(app, category, &log_id);

     let file = OpenOptions::new()
          .create(true)
          .append(true)
          .open(&log_path)
          .map_err(|e| e.to_string())?;

     Ok(InitLog {
          id: log_id,
          file: Arc::new(Mutex::new(file)),
     })
}

pub fn log_err(log: &Arc<Mutex<File>>, msg: &str) {
     if let Ok(mut f) = log.lock() {
          writeln!(
               f,
               "[{}] [ERROR] {}",
               chrono::Utc::now().to_rfc3339(),
               msg
          ).ok();
     }
}

pub fn log_info(log: &Arc<Mutex<File>>, msg: &str) {
     if let Ok(mut f) = log.lock() {
          writeln!(
               f,
               "[{}] {}",
               chrono::Utc::now().to_rfc3339(),
               msg
          ).ok();
     }
}

pub fn initialize_log_with_id(
    app: &tauri::AppHandle,
    category: LogCategory,
    log_id: &str,
) -> Result<InitLog, String> {
     let log_path = log_path(app, category, log_id);
     let log_file = Arc::new(Mutex::new(
          std::fs::OpenOptions::new()
               .create(true)
               .append(true)
               .open(&log_path)
               .map_err(|e| e.to_string())?,
     ));
     Ok(InitLog {
          id: log_id.to_string(),
          file: log_file,
     })
}

#[command]
#[specta(result)]
pub fn read_log(
    app: tauri::AppHandle,
    category: LogCategory,
    id: String,
) -> Result<String, String> {
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
     let mut path = app.path().app_data_dir().map_err(|e| e.to_string())?;
     path.push("logs");
     path.push(category.as_str());
     path.push(format!("{}.log", id));

     app.opener().open_path(path.to_string_lossy(), None::<&str>).map_err(|e| e.to_string())
}