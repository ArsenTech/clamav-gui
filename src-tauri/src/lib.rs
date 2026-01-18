// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![macro_use]

mod clamav;
mod sysinfo;

use crate::clamav::scan::{start_full_scan, start_main_scan, stop_scan, start_custom_scan};
use crate::sysinfo::{get_sys_info, get_sys_stats};
use crate::clamav::update::{update_definitions, get_clamav_version};

use specta::specta;
use std::process::Command;
use tauri::command;
use tauri_specta::{collect_commands, Builder};

#[command]
#[specta]
fn check_availability() -> bool {
    let command = if cfg!(windows) { "where" } else { "which" };
    Command::new(command)
        .arg("clamscan")
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        check_availability,
        get_sys_stats,
        get_sys_info,
        start_main_scan,
        start_full_scan,
        stop_scan,
        start_custom_scan,
        update_definitions,
        get_clamav_version
    ]);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
