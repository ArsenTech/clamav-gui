mod sysinfo;

use std::process::Command;
use tauri::command;
use crate::sysinfo::{get_sys_info, get_sys_stats};

#[command]
fn check_availability() -> bool {
    let command = if cfg!(windows) { "where" } else { "which" };
    let output = Command::new(command).arg("clamscan").output();

    match output {
        Ok(result) => !result.stdout.is_empty(),
        Err(_) => false,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_availability, get_sys_stats, get_sys_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}