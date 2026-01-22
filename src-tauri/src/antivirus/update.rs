use crate::antivirus::history::{HistoryItem, HistoryStatus, append_history};
use specta::specta;
use std::process::Command;
use tauri::{command, Emitter};

#[command]
#[specta(result)]
pub fn update_definitions(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = crate::system::new_id();

    append_history(
        &app,
        HistoryItem {
            id: crate::system::new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Definitions Update Started".into(),
            details: "ClamAV database update has started".into(),
            status: HistoryStatus::Success,
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

                if !stdout.is_empty() {
                    app.emit("freshclam:output", stdout.to_string()).ok();
                }

                if !stderr.is_empty() {
                    app.emit("freshclam:error", stderr.to_string()).ok();
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
                        log_id: Some(log_id),
                    },
                )
                .ok();

                app.emit("freshclam:done", exit_code).ok();
            }
            Err(e) => {
                app.emit("freshclam:error", e.to_string()).ok();
                append_history(
                    &app,
                    HistoryItem {
                        id: crate::system::new_id(),
                        timestamp: chrono::Utc::now().to_rfc3339(),
                        action: "Definitions Update Failed".into(),
                        details: e.to_string(),
                        status: HistoryStatus::Error,
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
