use crate::types::enums::{LogCategory,HistoryStatus};
use crate::types::structs::HistoryItem;
use crate::antivirus::history::append_history;
use crate::system::logs::{initialize_log, log_err, log_info};
use specta::specta;
use std::process::Command;
use tauri::{command, Emitter};

#[command]
#[specta(result)]
pub fn update_definitions(app: tauri::AppHandle) -> Result<(), String> {
    let init = initialize_log(&app, LogCategory::Update)?;
    let log_id = init.id.clone();
    let log_file = init.file.clone();

    append_history(
        &app,
        HistoryItem {
            id: crate::system::new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Definitions Update Started".into(),
            details: "ClamAV database update has started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Update),
            log_id: Some(log_id.clone()),
        },
    )
    .ok();

    std::thread::spawn(move || {
        app.emit("freshclam:start", ()).ok();

        let output = Command::new("freshclam").arg("--stdout").output();

        match output {
            Ok(out) => {
                let stdout = String::from_utf8_lossy(&out.stdout);
                let stderr = String::from_utf8_lossy(&out.stderr);
                let exit_code = out.status.code().unwrap_or(-1);
                let log = log_file.clone();

                if !stdout.is_empty() {
                    app.emit("freshclam:output", &stdout.to_string()).ok();
                    log_info(&log, &stdout.to_string());
                }

                if !stderr.is_empty() {
                    app.emit("freshclam:error", &stderr.to_string()).ok();
                    log_err(&log, &stderr.to_string());
                }

                let (status, details) = match exit_code {
                    0 => (HistoryStatus::Success, "Definitions are already up to date".to_string()),
                    1 => (HistoryStatus::Warning, "Update completed with warnings".to_string()),
                    _ => (HistoryStatus::Error, format!("Update failed (exit code {})", exit_code)),
                };
                append_history(
                    &app,
                    HistoryItem {
                        id: crate::system::new_id(),
                        timestamp: chrono::Utc::now().to_rfc3339(),
                        action: "Definitions Update Finished".into(),
                        details,
                        status,
                        category: Some(LogCategory::Update),
                        log_id: Some(log_id),
                    },
                )
                .ok();

                app.emit("freshclam:done", exit_code).ok();
            }
            Err(e) => {
                let log = log_file.clone();
                app.emit("freshclam:error", e.to_string()).ok();
                log_err(&log, &e.to_string());
                append_history(
                    &app,
                    HistoryItem {
                        id: crate::system::new_id(),
                        timestamp: chrono::Utc::now().to_rfc3339(),
                        action: "Definitions Update Failed".into(),
                        details: e.to_string(),
                        status: HistoryStatus::Error,
                        category: Some(LogCategory::Update),
                        log_id: Some(log_id),
                    },
                )
                .ok();
            }
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn get_clamav_version() -> Result<String, String> {
    let output = Command::new("freshclam")
        .arg("--version")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
