pub mod flags;
pub mod history;
pub mod log;
pub mod matcher;
pub mod path;
pub mod quarantine;
pub mod real_time;
pub mod scan;
pub mod scheduler;
pub mod stats;
pub mod sys_tray;

use std::{
    path::PathBuf,
    process::{Command, Stdio},
};
use tauri_plugin_store::StoreExt;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub fn silent_command<P: AsRef<std::path::Path>>(program: P) -> Command {
    let mut cmd = Command::new(program.as_ref());
    #[cfg(windows)]
    {
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd.stdin(Stdio::null());
    cmd
}

pub fn new_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

pub fn resolve_command(command: &str) -> Result<PathBuf, String> {
    let find_command = if cfg!(windows) { "where" } else { "which" };
    let output = silent_command(find_command)
        .arg(command)
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(format!("{} not found", command));
    }
    let stdout = String::from_utf8_lossy(&output.stdout);
    let raw = stdout
        .lines()
        .next()
        .ok_or(format!("{} not found", command))?
        .trim();

    if raw.is_empty() {
        return Err(format!("{} not found", command));
    }
    let mut path = PathBuf::from(raw);
    #[cfg(windows)]
    {
        if path.extension().is_none() {
            path.set_extension("exe");
        }
    }
    Ok(path)
}

pub fn get_exclusions(app: &tauri::AppHandle) -> Result<Vec<String>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    let value = match store.get("exclusions") {
        Some(v) => v,
        None => return Ok(vec![]),
    };
    match value {
        serde_json::Value::Array(arr) => {
            Ok(arr.into_iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect::<Vec<_>>()
                .into())
        }
        _ => {
            eprintln!("Invalid exclusions format, expected array");
            Ok(vec![])
        }
    }
}
