pub mod flags;
pub mod history;
pub mod log;
pub mod quarantine;
pub mod scan;
pub mod scheduler;

use std::process::Command;

#[cfg(windows)]
use std::{os::windows::process::CommandExt, path::PathBuf};

const CREATE_NO_WINDOW: u32 = 0x08000000;

pub fn silent_command(program: &str) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(windows)]
    {
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
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