mod antivirus;
mod system;
mod types;
mod helpers;

use tauri_specta::{collect_commands, Builder};

// Local Crates
use crate::{
    antivirus::{
        bulk_actions::{clear_quarantine, delete_all, quarantine_all, restore_all},
        history::{load_history, mark_as_acknowledged, clear_history},
        quarantine::{
            delete_quarantine, list_quarantine, quarantine_file, restore_quarantine,
        },
        scan::{start_custom_scan, start_full_scan, start_main_scan, stop_scan},
        update::{get_clamav_version, update_definitions},
        stats::get_stats
    },
    system::{
        remove_file,
        check_availability,
        sysinfo::{get_sys_info, get_sys_stats},
        logs::{read_log, reveal_log}
    }
};

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
        reveal_log,
        get_stats
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
