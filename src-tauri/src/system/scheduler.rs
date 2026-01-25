use specta::specta;
use tauri::{Manager,command};

#[cfg(windows)]
use crate::helpers::scheduler::schedule_scan_windows;
use crate::{
     helpers::{resolve_command, scheduler::{load_scheduler_file, remove_job_windows, run_job_now_windows}},
     types::{
          enums::{DayOfTheWeek, ScanType, SchedulerInterval},
          structs::SchedulerEvent
     },
};

#[command]
#[specta(result)]
pub fn schedule_task(
    app: tauri::AppHandle,
    interval: SchedulerInterval,
    days: DayOfTheWeek,
    hours: u32,
    minutes: u32,
    scan_type: ScanType,
) -> Result<(), String> {
     let time = format!("{:02}:{:02}", hours, minutes);
     let task_name = format!("ClamAV GUI Scan ({} - {:?})", match scan_type {
          ScanType::Main => "Main",
          ScanType::Full => "Full",
          ScanType::Custom => "Custom",
          _ => return Err("Unsupported scan type".into())
     }, interval);
     let gui_command = resolve_command("clamav-gui")?;
     let scan_args = match scan_type {
          ScanType::Main => "--scan=main",
          ScanType::Full => "--scan=full",
          ScanType::Custom => return Err("Custom scan scheduling not supported yet".into()),
          _ => return Ok(())
     };
     let task_command = format!(
          r#""{}" {} --scheduled"#,
          gui_command.to_string_lossy(),
          scan_args
     );

     #[cfg(windows)]{
          schedule_scan_windows(&app, task_name, time, task_command, interval, days, scan_type)
     }
     #[cfg(not(windows))]
     {
          Err("Scheduler not supported on this platform yet".into())
     }
}

#[command]
#[specta(result)]
pub fn remove_scheduled_task(app: tauri::AppHandle,task_name: String) -> Result<(),String>{
     #[cfg(windows)]{
          remove_job_windows(&app,task_name)
     }
     #[cfg(not(windows))]
     {
          Err("Scheduler not supported on this platform yet".into())
     }
}

#[command]
#[specta(result)]
pub fn list_scheduler(app: tauri::AppHandle) -> Result<Vec<SchedulerEvent>,String>{
     let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;

     let file_path = config_dir.join("scheduler.json");
     std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
     let scheduler_file = load_scheduler_file(&file_path)?;

     let items = scheduler_file
          .schedulers
          .into_iter()
          .map(|entry| SchedulerEvent {
               id: entry.id,
               interval: entry.interval,
               scan_type: entry.scan_type,
               days: entry.days,
               time: entry.time,
               log_id: entry.log_id
          })
          .collect();

    Ok(items)
}

#[command]
#[specta(result)]
pub fn run_job_now(app: tauri::AppHandle,task_name: String) -> Result<(),String>{
     #[cfg(windows)]{
          run_job_now_windows(&app,task_name)
     }
     #[cfg(not(windows))]
     {
          Err("Scheduler not supported on this platform yet".into())
     }
}