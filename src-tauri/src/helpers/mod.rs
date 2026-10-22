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
pub mod i18n;
pub mod settings;

use std::{
    path::PathBuf,
    process::{Command, Stdio},
};

use crate::system::backend_errors::{self};

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
        return Err(serde_json::json!({
            "code": backend_errors::NO_COMMAND,
            "params": { "command": command }
        }).to_string());
    }
    let stdout = String::from_utf8_lossy(&output.stdout);
    let raw = stdout
        .lines()
        .next()
        .ok_or(format!("{} not found", command))?
        .trim();

    if raw.is_empty() {
        return Err(serde_json::json!({
            "code": backend_errors::NO_COMMAND,
            "params": { "command": command }
        }).to_string());
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