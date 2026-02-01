use tauri::{Emitter, Manager};

use crate::{
    helpers::{
        history::append_scheduler_history,
        log::{initialize_log, log_err, log_info},
        new_id, resolve_command,
        scheduler::{load_scheduler_file, save_scheduler_file},
        silent_command,
    },
    types::{
        enums::{DayOfTheWeek, HistoryStatus, LogCategory, ScanType, SchedulerInterval},
        structs::{HistoryItem, SchedulerEntry, SchedulerEvent},
    },
};

pub fn schedule_scan(
    app: &tauri::AppHandle,
    task_name: String,
    time: String,
    task_command: String,
    interval: SchedulerInterval,
    days: DayOfTheWeek,
    scan_type: ScanType,
) -> Result<(), String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }
    if time.trim().is_empty() {
        return Err("Time cannot be empty".into());
    }
    if task_command.trim().is_empty() {
        return Err("Task command cannot be empty".into());
    }

    let log = initialize_log(app, LogCategory::Scheduler)?;
    let log_id = log.id.clone();
    let log_file = log.file.clone();

    let schtasks = resolve_command("schtasks")?;
    let mut cmd = silent_command(schtasks.to_str().unwrap());
    cmd.args([
        "/create",
        "/tn",
        &format!(r"\{}", task_name),
        "/st",
        &time,
        "/tr",
        &task_command,
        "/f",
    ]);

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

    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;

    std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    let file_path = config_dir.join("scheduler.json");

    let mut scheduler_file = load_scheduler_file(&file_path)?;

    if scheduler_file.schedulers.iter().any(|e| e.id == task_name) {
        log_err(&log_file, "Scheduled job already exists");
        return Err("Scheduled job already exists".into());
    }

    let last_run = get_last_run_time(&task_name).unwrap_or(None);

    let entry = SchedulerEntry {
        id: task_name.clone(),
        scan_type,
        interval,
        days,
        time: time.clone(),
        enabled: true,
        last_run: last_run.clone(),
        created_at: chrono::Utc::now().to_rfc3339(),
        log_id: Some(log_id.clone()),
    };

    scheduler_file.schedulers.push(entry);
    save_scheduler_file(&file_path, &scheduler_file)?;

    if let Err(e) = app.emit(
        "scheduler:created",
        SchedulerEvent {
            id: task_name.clone(),
            scan_type,
            interval,
            days,
            time,
            last_run: last_run.clone(),
            log_id: Some(log_id.clone()),
        },
    ) {
        log_err(
            &log_file,
            &format!("Failed to emit scheduler:created event: {}", e),
        );
    }
    log_info(
        &log_file,
        &format!("New Scheduled Job Created Successfully: {}", task_name),
    );

    append_scheduler_history(
        app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "New Scheduled Scan Job created".into(),
            details: format!("New Scheduled Job Created Successfully: {}", task_name),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scheduler),
            log_id: Some(log_id),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );

    Ok(())
}

pub fn remove_job(app: &tauri::AppHandle, task_name: String) -> Result<(), String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }

    let log = initialize_log(app, LogCategory::Scheduler)?;
    let log_id = log.id.clone();
    let log_file = log.file.clone();

    let schtasks = resolve_command("schtasks")?;
    let mut cmd = silent_command(schtasks.to_str().unwrap());
    cmd.args(["/delete", "/tn", &task_name, "/f"]);

    let status = cmd.status().map_err(|e| e.to_string())?;
    if !status.success() {
        log_err(&log_file, "Failed to delete scheduled task");
        return Err("Failed to delete scheduled task".into());
    }

    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;

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

    if let Err(e) = app.emit("scheduler:deleted", &task_name) {
        log_err(
            &log_file,
            &format!("Failed to emit scheduler:deleted event: {}", e),
        );
    }

    log_info(
        &log_file,
        &format!("Scan Job Deleted Successfully: {}", task_name),
    );

    append_scheduler_history(
        app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scheduled Scan Job Deleted".into(),
            details: format!("Scan Job Deleted Successfully: {}", task_name),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scheduler),
            log_id: Some(log_id),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );

    Ok(())
}

pub fn run_job_now(app: &tauri::AppHandle, task_name: String) -> Result<(), String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }

    let log = initialize_log(app, LogCategory::Scheduler)?;
    let log_id = log.id.clone();
    let log_file = log.file.clone();

    let schtasks = resolve_command("schtasks")?;
    let mut cmd = silent_command(schtasks.to_str().unwrap());

    cmd.args(["/run", "/tn", &task_name]);

    let status = cmd.status().map_err(|e| e.to_string())?;

    if status.success() {
        log_info(
            &log_file,
            &format!("Scheduled job triggered manually: {}", task_name),
        );

        append_scheduler_history(
            app,
            HistoryItem {
                id: new_id(),
                timestamp: chrono::Utc::now().to_rfc3339(),
                action: "Scheduled job Triggered".into(),
                details: format!("Scheduled job triggered manually: {}", task_name),
                status: HistoryStatus::Success,
                category: Some(LogCategory::Scheduler),
                log_id: Some(log_id),
                scan_type: None,
                threat_count: None,
                scan_result: None,
            },
            &log_file,
        );
        Ok(())
    } else {
        log_err(&log_file, "Failed to run scheduled task");

        append_scheduler_history(
            app,
            HistoryItem {
                id: new_id(),
                timestamp: chrono::Utc::now().to_rfc3339(),
                action: "Scheduled job Triggered".into(),
                details: format!("Failed to run scheduled task: {}", task_name),
                status: HistoryStatus::Error,
                category: Some(LogCategory::Scheduler),
                log_id: Some(log_id),
                scan_type: None,
                threat_count: None,
                scan_result: None,
            },
            &log_file,
        );
        Err("Failed to run scheduled task".into())
    }
}

pub fn get_last_run_time(task_name: &str) -> Result<Option<String>, String> {
    if task_name.trim().is_empty() {
        return Err("Task name cannot be empty".into());
    }

    let full_name = format!(r"\{}", task_name);
    let schtasks = resolve_command("schtasks")?;
    let mut cmd = silent_command(schtasks.to_str().unwrap());

    let output = cmd
        .args(["/query", "/tn", &full_name, "/fo", "CSV", "/v"])
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        return Err(format!("schtasks query failed: {}", err));
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut lines = stdout.lines();

    let header = lines.next().ok_or("Missing CSV header")?;
    let row = lines.next().ok_or("Missing CSV row")?;

    let headers: Vec<&str> = header.split(',').map(|s| s.trim_matches('"')).collect();
    let values: Vec<&str> = row.split(',').map(|s| s.trim_matches('"')).collect();

    let idx = headers
        .iter()
        .position(|h| *h == "Last Run Time")
        .ok_or("Last Run Time column not found")?;

    let last_run = values.get(idx).map(|v| v.to_string());

    Ok(match last_run.as_deref() {
        Some("N/A") | Some("30/11/1999 00:00:00") | Some("01/01/1970 00:00:00") | None => None,
        Some(v) if v.trim().is_empty() => None,
        Some(v) => Some(v.trim().to_string()),
    })
}
