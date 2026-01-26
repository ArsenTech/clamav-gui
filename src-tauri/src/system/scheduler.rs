use specta::specta;
use std::process::Stdio;
use tauri::{command, Manager};

use crate::{
    helpers::{
        resolve_command,
        scheduler::{get_last_run_time_windows, load_scheduler_file, save_scheduler_file},
        silent_command,
    },
    types::{
        enums::{DayOfTheWeek, ScanType, SchedulerInterval},
        structs::SchedulerEvent,
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
    if hours > 23 {
        return Err("Hours must be between 0 and 23".into());
    }
    if minutes > 59 {
        return Err("Minutes must be between 0 and 59".into());
    }
    let time = format!("{:02}:{:02}", hours, minutes);

    let scan_name = match scan_type {
        ScanType::Main => "Main",
        ScanType::Full => "Full",
        ScanType::Custom => return Err("Custom scan scheduling not supported yet".into()),
        _ => return Err("Unsupported scan type".into()),
    };

    let task_name = format!("ClamAV GUI - {} - {:?}", scan_name, interval);

    let gui_command = resolve_command("clamav-gui")?;

    let scan_args = match scan_type {
        ScanType::Main => "--scan=main",
        ScanType::Full => "--scan=full",
        ScanType::Custom => return Err("Custom scan scheduling not supported yet".into()),
        _ => return Err("Unsupported scan type".into()),
    };

    let task_command = format!(
        r#""{}" {} --scheduled"#,
        gui_command.to_string_lossy(),
        scan_args
    );

    #[cfg(windows)]
    {
        use crate::helpers::scheduler::schedule_scan_windows;
        schedule_scan_windows(
            &app,
            task_name,
            time,
            task_command,
            interval,
            days,
            scan_type,
        )
    }
    #[cfg(not(windows))]
    {
        Err("Scheduler not supported on this platform yet".into())
    }
}

#[command]
#[specta(result)]
pub fn remove_scheduled_task(app: tauri::AppHandle, task_name: String) -> Result<(), String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }

    #[cfg(windows)]
    {
        use crate::helpers::scheduler::remove_job_windows;
        remove_job_windows(&app, task_name)
    }
    #[cfg(not(windows))]
    {
        Err("Scheduler not supported on this platform yet".into())
    }
}

#[command]
#[specta(result)]
pub fn list_scheduler(app: tauri::AppHandle) -> Result<Vec<SchedulerEvent>, String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;

    let file_path = config_dir.join("scheduler.json");
    std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;

    let scheduler_file = load_scheduler_file(&file_path)?;

    let items: Vec<SchedulerEvent> = scheduler_file
        .schedulers
        .into_iter()
        .map(|entry| {
            let last_run = match entry.last_run {
                Some(time) => get_last_run_time_windows(&entry.id).unwrap_or(Some(time)),
                None => get_last_run_time_windows(&entry.id).unwrap_or(None),
            };

            SchedulerEvent {
                id: entry.id,
                interval: entry.interval,
                scan_type: entry.scan_type,
                days: entry.days,
                time: entry.time,
                last_run,
                log_id: entry.log_id,
            }
        })
        .collect();

    Ok(items)
}

#[command]
#[specta(result)]
pub fn run_job_now(app: tauri::AppHandle, task_name: String) -> Result<(), String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }
    #[cfg(windows)]
    {
        use crate::helpers::scheduler::run_job_now_windows;
        run_job_now_windows(&app, task_name)
    }
    #[cfg(not(windows))]
    {
        Err("Scheduler not supported on this platform yet".into())
    }
}

#[command]
#[specta(result)]
pub fn clear_scheduled_jobs(app: tauri::AppHandle) -> Result<(), String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;

    let file_path = config_dir.join("scheduler.json");
    let mut scheduler_file = load_scheduler_file(&file_path)?;

    if scheduler_file.schedulers.is_empty() {
        return Ok(());
    }
    #[cfg(windows)]
    {
        let schtasks = resolve_command("schtasks")?;
        let mut failed_deletions = Vec::new();

        for entry in &scheduler_file.schedulers {
            let result = silent_command(schtasks.to_str().unwrap())
                .args(["/delete", "/tn", &entry.id, "/f"])
                .stdin(Stdio::null())
                .status();

            if let Err(e) = result {
                failed_deletions.push(format!("{}: {}", entry.id, e));
            } else if let Ok(status) = result {
                if !status.success() {
                    failed_deletions.push(format!("{}: Task deletion failed", entry.id));
                }
            }
        }

        scheduler_file.schedulers.clear();
        save_scheduler_file(&file_path, &scheduler_file)?;

        if !failed_deletions.is_empty() {
            eprintln!("Some tasks failed to delete: {:?}", failed_deletions);
        }

        Ok(())
    }
    #[cfg(not(windows))]
    {
        Err("Scheduler not supported on this platform yet".into())
    }
}
