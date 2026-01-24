use std::process::Stdio;
use tauri::{Manager, Emitter};
use std::path::PathBuf;

use crate::{
    helpers::{history::append_history, log::{initialize_log, log_err, log_info}, new_id, silent_command},
    types::{enums::{DayOfTheWeek, HistoryStatus, LogCategory, ScanType, SchedulerInterval}, structs::{HistoryItem, SchedulerEntry, SchedulerEvent, SchedulerFile}},
};

pub fn load_scheduler_file(path: &PathBuf) -> Result<SchedulerFile, String> {
     if path.exists() {
          let data = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
          serde_json::from_str(&data).map_err(|e| e.to_string())
     } else {
          Ok(SchedulerFile {
               version: 1,
               schedulers: Vec::new(),
          })
     }
}

fn save_scheduler_file(path: &PathBuf, file: &SchedulerFile) -> Result<(), String> {
     let tmp = path.with_extension("tmp");
     let json = serde_json::to_string_pretty(file).map_err(|e| e.to_string())?;
     std::fs::write(&tmp, json).map_err(|e| e.to_string())?;
     std::fs::rename(tmp, path).map_err(|e| e.to_string())?;
     Ok(())
}

pub fn schedule_scan_windows(
    app: &tauri::AppHandle,
    task_name: String,
    time: String,
    task_command: String,
    interval: SchedulerInterval,
    days: DayOfTheWeek,
    scan_type: ScanType,
) -> Result<(), String> {
     let log = initialize_log(app, LogCategory::Scheduler)?;
     let log_id = log.id.clone();
     let log_file = log.file.clone();
     let mut cmd = silent_command("schtasks");

     cmd.args([
          "/create",
          "/tn",
          &task_name,
          "/st",
          &time,
          "/tr",
          &task_command,
          "/f",
     ])
     .stdin(Stdio::null());

     match interval {
          SchedulerInterval::Daily => {
               cmd.args(["/sc", "daily"]);
          }
          SchedulerInterval::Weekly => {
               let day = days.as_str().to_ascii_uppercase();
               cmd.args(["/sc", "weekly", "/d", &day]);
          }
          SchedulerInterval::Monthly => {
               cmd.args(["/sc", "monthly"]);
          }
     }

     let status = cmd.status().map_err(|e| e.to_string())?;
     if !status.success() {
          log_err(&log_file, "Failed to create scheduled task");
          return Err("Failed to create scheduled task".into());
     }

     let config_dir = app
          .path()
          .app_config_dir()
          .map_err(|e| e.to_string())?;

     std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
     let file_path = config_dir.join("scheduler.json");

     let mut scheduler_file = load_scheduler_file(&file_path)?;

     let entry = SchedulerEntry {
          id: task_name.clone(),
          scan_type,
          interval,
          days,
          time: time.clone(),
          enabled: true,
          last_run: None,
          created_at: chrono::Utc::now().to_rfc3339(),
          log_id: Some(log_id.clone())
     };
     scheduler_file.schedulers.push(entry);
     save_scheduler_file(&file_path, &scheduler_file)?;

     app.emit(
          "scheduler:created",
          SchedulerEvent {
               id: task_name.clone(),
               scan_type,
               interval,
               days,
               time,
               log_id: Some(log_id.clone())
          },
     )
     .map_err(|e| e.to_string())?;

     log_info(&log_file, &format!("New Scheduled Job Created Successfully: {}", task_name));
     if let Err(e) = append_history(app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: "New Scheduled Scan Job created".into(),
          details: format!("New Scheduled Job Created Successfully: {}", task_name).into(),
          status: HistoryStatus::Success,
          category: Some(LogCategory::Scheduler),
          log_id: Some(log_id.clone()),
          scan_type: None,
          threat_count: None,
          scan_result: None,
     }) {
          log_err(&log_file, &e.to_string());
     }

     Ok(())
}

pub fn remove_job_windows(
     app: &tauri::AppHandle,
     task_name: String,
) -> Result<(),String> {
     let log = initialize_log(app, LogCategory::Scheduler)?;
     let log_id = log.id.clone();
     let log_file = log.file.clone();
     let mut cmd = silent_command("schtasks");
     cmd.args([
          "/delete",
          "/tn",
          &task_name,
          "/f",
     ])
     .stdin(Stdio::null());

     let status = cmd.status().map_err(|e| e.to_string())?;
     if !status.success() {
          log_err(&log_file, "Failed to delete scheduled task");
          return Err("Failed to delete scheduled task".into());
     }

     let config_dir = app
          .path()
          .app_config_dir()
          .map_err(|e| e.to_string())?;

     std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
     let file_path = config_dir.join("scheduler.json");

     let mut scheduler_file = load_scheduler_file(&file_path)?;

     let before = scheduler_file.schedulers.len();
     scheduler_file
          .schedulers
          .retain(|entry| entry.id != task_name);

     if scheduler_file.schedulers.len() == before {
          log_err(&log_file, "Scheduled job not found in scheduler.json");
          return Err("Scheduled job not found in scheduler.json".into());
     }

     save_scheduler_file(&file_path, &scheduler_file)?;

     app.emit("scheduler:deleted", &task_name)
          .map_err(|e| e.to_string())?;

     log_info(&log_file, &format!("Scan Job Deleted Successfully: {}", task_name));
     if let Err(e) = append_history(app, HistoryItem {
          id: new_id(),
          timestamp: chrono::Utc::now().to_rfc3339(),
          action: "Scheduled Scan Job Deleted".into(),
          details: format!("Scan Job Deleted Successfully: {}", task_name).into(),
          status: HistoryStatus::Success,
          category: Some(LogCategory::Scheduler),
          log_id: Some(log_id.clone()),
          scan_type: None,
          threat_count: None,
          scan_result: None,
     }) {
          log_err(&log_file, &e.to_string());
     }

     Ok(())
}

pub fn run_job_now_windows(app: &tauri::AppHandle, task_name: String) -> Result<(), String> {
     let log = initialize_log(app, LogCategory::Scheduler)?;
     let log_id = log.id.clone();
     let log_file = log.file.clone();
     let mut cmd = silent_command("schtasks");

     cmd.args([
          "/run",
          "/tn",
          &task_name,
     ])
     .stdin(Stdio::null());

     let status = cmd.status().map_err(|e| e.to_string())?;

     if status.success() {
          log_info(&log_file, &format!("Scheduled job triggered manually: {}", task_name));
          if let Err(e) = append_history(app, HistoryItem {
               id: new_id(),
               timestamp: chrono::Utc::now().to_rfc3339(),
               action: "Scheduled job Triggered".into(),
               details: format!("Scheduled job triggered manually: {}", task_name).into(),
               status: HistoryStatus::Success,
               category: Some(LogCategory::Scheduler),
               log_id: Some(log_id.clone()),
               scan_type: None,
               threat_count: None,
               scan_result: None
          }) {
               log_err(&log_file, &e.to_string());
          }
          Ok(())
     } else {
          log_err(&log_file, "Failed to run scheduled task");
          if let Err(e) = append_history(app, HistoryItem {
               id: new_id(),
               timestamp: chrono::Utc::now().to_rfc3339(),
               action: "Scheduled job Triggered".into(),
               details: format!("Failed to run scheduled task: {}", task_name).into(),
               status: HistoryStatus::Error,
               category: Some(LogCategory::Scheduler),
               log_id: Some(log_id.clone()),
               scan_type: None,
               threat_count: None,
               scan_result: None
          }) {
               log_err(&log_file, &e.to_string());
          }
          Err("Failed to run scheduled task".into())
     }
}