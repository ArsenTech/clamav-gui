use specta::specta;
use tauri::command;

use crate::helpers::silent_command;

const CLAMD_SERVICE: &str = "clamd";

#[command]
#[specta(result)]
pub fn clamd_start() -> Result<(), String> {
    if cfg!(windows) {
        return Err("ClamD service control is not supported on Windows".into());
    }
    silent_command("systemctl")
        .args(["start", CLAMD_SERVICE])
        .status()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
#[specta(result)]
pub fn clamd_shutdown() -> Result<(), String> {
    if cfg!(windows) {
        return Err("ClamD service control is not supported on Windows".into());
    }

    silent_command("systemctl")
        .args(["stop", CLAMD_SERVICE])
        .status()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
#[specta(result)]
pub fn clamd_ping() -> Result<bool, String> {
    if cfg!(windows) {
        return Err("ClamD service control is not supported on Windows".into());
    }
    let status = silent_command("clamdscan")
        .arg("-p")
        .arg("1")
        .status()
        .map_err(|e| e.to_string())?;

    Ok(status.success())
}
