#![macro_use]

mod antivirus;
mod system;
mod types;

use specta::specta;
use std::process::Command;
use tauri::command;
use tauri_specta::{collect_commands, Builder};

// Local Crates
use crate::antivirus::bulk_actions::{clear_quarantine, delete_all, quarantine_all, restore_all};
use crate::antivirus::history::{load_history, mark_as_acknowledged, clear_history};
use crate::antivirus::quarantine::{
    delete_quarantine, list_quarantine, quarantine_file, restore_quarantine,
};
use crate::system::remove_file;
use crate::antivirus::scan::{start_custom_scan, start_full_scan, start_main_scan, stop_scan};
use crate::antivirus::update::{get_clamav_version, update_definitions};
use crate::system::sysinfo::{get_sys_info, get_sys_stats};
use crate::system::logs::{read_log, reveal_log};

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
        start_custom_scan,
        stop_scan,
        update_definitions,
        get_clamav_version,
        quarantine_file,
        list_quarantine,
        restore_quarantine,
        delete_quarantine,
        remove_file,
        quarantine_all,
        delete_all,
        restore_all,
        clear_quarantine,
        load_history,
        mark_as_acknowledged,
        clear_history,
        read_log,
        reveal_log
    ]);

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
