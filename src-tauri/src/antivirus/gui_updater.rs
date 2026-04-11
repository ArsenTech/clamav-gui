use specta::specta;
use tauri::command;

use crate::{
     helpers::{history::append_history, new_id},
     types::{
          enums::{AppendUpdaterErrorType, HistoryDetails, HistoryStatus, HistoryType, LogCategory}, 
          structs::HistoryItem
     }
};

#[command]
#[specta(result)]
pub fn append_updater_error(app: tauri::AppHandle, error: String, error_type: AppendUpdaterErrorType) -> Result<(), String> {
     let (action, details) = if error_type == AppendUpdaterErrorType::CheckError {
          (
               HistoryType::GuiUpdaterCheckError,
               HistoryDetails::GuiUpdaterCheckError { err: error }
          )
     } else {
         (
               HistoryType::GuiUpdaterError,
               HistoryDetails::GuiUpdaterError { err: error }
         )
     };
     append_history(&app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: Some(action),
          details: Some(details),
          status: HistoryStatus::Error,
          category: Some(LogCategory::GuiUpdater),
          log_id: None,
          scan_type: None,
          threat_count: None,
          scan_result: None,
     })
}

#[command]
#[specta(result)]
pub fn append_updater_start_log(app: tauri::AppHandle) -> Result<(),String>{
     append_history(&app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: Some(HistoryType::GuiUpdaterStarted),
          details: Some(HistoryDetails::GuiUpdaterStarted),
          status: HistoryStatus::Success,
          category: Some(LogCategory::GuiUpdater),
          log_id: None,
          scan_type: None,
          threat_count: None,
          scan_result: None,
     })
}

#[command]
#[specta(result)]
pub fn append_updater_finish_log(app: tauri::AppHandle) -> Result<(),String>{
     append_history(&app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: Some(HistoryType::GuiUpdaterFinished),
          details: Some(HistoryDetails::GuiUpdaterFinished),
          status: HistoryStatus::Success,
          category: Some(LogCategory::GuiUpdater),
          log_id: None,
          scan_type: None,
          threat_count: None,
          scan_result: None,
     })
}

#[command]
#[specta(result)]
pub fn append_updater_updated_log(app: tauri::AppHandle, version: String) -> Result<(),String>{
     append_history(&app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: Some(HistoryType::GuiUpdaterUpdated),
          details: Some(HistoryDetails::GuiUpdaterUpdated {version}),
          status: HistoryStatus::Success,
          category: Some(LogCategory::GuiUpdater),
          log_id: None,
          scan_type: None,
          threat_count: None,
          scan_result: None,
     })
}

#[command]
#[specta(result)]
pub fn append_updater_needed_log(app: tauri::AppHandle) -> Result<(),String>{
     append_history(&app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: Some(HistoryType::GuiUpdaterNeeded),
          details: Some(HistoryDetails::GuiUpdaterNeeded),
          status: HistoryStatus::Success,
          category: Some(LogCategory::GuiUpdater),
          log_id: None,
          scan_type: None,
          threat_count: None,
          scan_result: None,
     })
}