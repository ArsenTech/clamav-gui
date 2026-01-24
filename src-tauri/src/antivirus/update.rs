use std::process::Stdio;

use specta::specta;
use tauri::{command, Emitter};

use crate::{
    helpers::{
        history::append_update_history,
        log::{initialize_log, log_err, log_info},
        new_id, silent_command,
    },
    types::{
        enums::{HistoryStatus, LogCategory},
        structs::HistoryItem,
    },
};

#[command]
#[specta(result)]
pub fn update_definitions(app: tauri::AppHandle) -> Result<(), String> {
    let init = initialize_log(&app, LogCategory::Update)?;
    let log_id = init.id.clone();
    let log_file = init.file.clone();

    append_update_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Definitions Update Started".into(),
            details: "ClamAV database update has started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Update),
            log_id: Some(log_id.clone()),
            scan_type: None,
            threat_count: None,
            scan_result: None,
        },
        &log_file
    );
    std::thread::spawn(move || {
        app.emit("freshclam:start", ()).ok();

        let output = silent_command("freshclam")
            .arg("--stdout")
            .stdin(Stdio::null())
            .output();
        match output {
            Ok(out) => {
                let stdout = String::from_utf8_lossy(&out.stdout);
                let stderr = String::from_utf8_lossy(&out.stderr);
                let exit_code = out.status.code().unwrap_or(-1);

                if !stdout.is_empty() {
                    let stdout_str = stdout.to_string();
                    app.emit("freshclam:output", &stdout_str).ok();
                    log_info(&log_file, &stdout_str);
                }
                if !stderr.is_empty() {
                    let stderr_str = stderr.to_string();
                    app.emit("freshclam:error", &stderr_str).ok();
                    log_err(&log_file, &stderr_str);
                }

                let (status, details) = match exit_code {
                    0 => (
                        HistoryStatus::Success,
                        "Definitions are already up to date".to_string(),
                    ),
                    1 => (
                        HistoryStatus::Warning,
                        "Update completed with warnings".to_string(),
                    ),
                    _ => (
                        HistoryStatus::Error,
                        format!("Update failed with exit code {}", exit_code),
                    ),
                };
                append_update_history(
                    &app,
                    HistoryItem {
                        id: new_id(),
                        timestamp: chrono::Utc::now().to_rfc3339(),
                        action: "Definitions Update Finished".into(),
                        details,
                        status,
                        category: Some(LogCategory::Update),
                        log_id: Some(log_id),
                        scan_type: None,
                        threat_count: None,
                        scan_result: None,
                    },
                    &log_file
                );

                app.emit("freshclam:done", exit_code).ok();
            }
            Err(e) => {
                let error_msg = e.to_string();
                app.emit("freshclam:error", &error_msg).ok();
                log_err(&log_file, &error_msg);

                append_update_history(
                    &app,
                    HistoryItem {
                        id: new_id(),
                        timestamp: chrono::Utc::now().to_rfc3339(),
                        action: "Definitions Update Failed".into(),
                        details: error_msg,
                        status: HistoryStatus::Error,
                        category: Some(LogCategory::Update),
                        log_id: Some(log_id),
                        scan_type: None,
                        threat_count: None,
                        scan_result: None,
                    },
                    &log_file
                );
            }
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn get_clamav_version() -> Result<String, String> {
    let output = silent_command("freshclam")
        .arg("--version")
        .stdin(Stdio::null())
        .output()
        .map_err(|e| e.to_string())?;

    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}
