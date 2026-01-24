// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![macro_use]

mod antivirus;
mod helpers;
mod system;
mod types;

use tauri_specta::{collect_commands, Builder};

use crate::{
    antivirus::{
        bulk_actions::{clear_quarantine, delete_all, quarantine_all, restore_all},
        history::{clear_history, load_history, mark_as_acknowledged},
        quarantine::{delete_quarantine, list_quarantine, quarantine_file, restore_quarantine},
        scan::{get_startup_scan, start_custom_scan, start_full_scan, start_main_scan, stop_scan},
        stats::get_stats,
        update::{get_clamav_version, update_definitions},
    },
    helpers::{
        parse_flags,
        scan_types::{run_full_scan, run_main_scan},
    },
    system::{
        check_availability,
        logs::{read_log, reveal_log},
        remove_file,
        scheduler::{list_scheduler,schedule_task,remove_scheduled_task,run_job_now},
        sysinfo::{get_sys_info, get_sys_stats},
    },
    types::{enums::ScanType, structs::StartupScan},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let scan_flag = parse_flags();

    let specta_builder = Builder::<tauri::Wry>::new().commands(collect_commands![
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
        get_stats,
        get_startup_scan,
        schedule_task,
        list_scheduler,
        remove_scheduled_task,
        run_job_now
    ]);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .manage(StartupScan {
            scan_type: scan_flag.clone(),
            is_startup: scan_flag.is_some()
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(specta_builder.invoke_handler())
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(move |app_handle, event| {
        if let tauri::RunEvent::Ready = event {
            if let Some(scan_type) = scan_flag.clone() {
                let handle = app_handle.clone();
                std::thread::spawn(move || match scan_type {
                    ScanType::Main => {
                        run_main_scan(handle).ok();
                    }
                    ScanType::Full => {
                        run_full_scan(handle).ok();
                    }
                    _ => {}
                });
            }
        }
    });
}
