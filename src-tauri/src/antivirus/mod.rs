pub mod bulk_actions;
pub mod history;
pub mod quarantine;
pub mod scan;
pub mod stats;
pub mod update;
pub mod clamd;

use tauri::command;
use specta::specta;

use crate::{
     helpers::{
          history::append_history,
          log::{ initialize_log, log_err },
          new_id,
          real_time::{ start_realtime_scan, stop_realtime_scan }
     },
     types::{
          enums::{HistoryStatus, LogCategory, ScanType},
          structs::HistoryItem
     }
};

#[command]
#[specta(result)]
pub fn start_real_time_scan(app: tauri::AppHandle, paths: Vec<String>) -> Result<(),String>{
     let log = initialize_log(&app, LogCategory::Realtime)?;
     let log_id = log.id.clone();
     let log_file = log.file.clone();
     start_realtime_scan(paths.clone());
     if let Err(e) = append_history(&app, HistoryItem{
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: "Real-time Scan Started".into(),
          details: format!("Real-time scan started, Monitoring {} paths",paths.len()),
          status: HistoryStatus::Success,
          category: Some(LogCategory::Realtime),
          log_id: Some(log_id.clone()),
          scan_type: Some(ScanType::Realtime),
          threat_count: None,
          scan_result: None
     }) {
          log_err(&log_file, &format!("Failed to append the real time scan history item: {}",&e.to_string()));
     }
     Ok(())
}

#[command]
#[specta(result)]
pub fn stop_real_time_scan(app: tauri::AppHandle,) -> Result<(),String> {
     let log = initialize_log(&app, LogCategory::Realtime)?;
     let log_id = log.id.clone();
     let log_file = log.file.clone();
     stop_realtime_scan();
     if let Err(e) = append_history(&app, HistoryItem{
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: "Real-time Scan Stopped".into(),
          details: "The real-time scan has been stopped. The device will be vulnerable".into(),
          status: HistoryStatus::Warning,
          category: Some(LogCategory::Realtime),
          log_id: Some(log_id.clone()),
          scan_type: Some(ScanType::Realtime),
          threat_count: None,
          scan_result: None
     }) {
          log_err(&log_file, &format!("Failed to append the real time scan history item: {}",&e.to_string()));
     }
     Ok(())
}