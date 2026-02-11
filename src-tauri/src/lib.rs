// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![macro_use]

mod antivirus;
mod helpers;
mod system;
mod types;

use std::sync::{
    atomic::Ordering,
    Mutex
};
use tauri_specta::{collect_commands, Builder};

use crate::{
    antivirus::{
        bulk_actions::{clear_quarantine, delete_all, quarantine_all, restore_all},
        history::{clear_history, load_history, mark_as_acknowledged},
        quarantine::{delete_quarantine, list_quarantine, quarantine_file, restore_quarantine},
        scan::{get_startup_scan, start_custom_scan, start_full_scan, start_main_scan, stop_scan},
        start_real_time_scan,
        stats::get_stats,
        stop_real_time_scan,
        update::{get_clamav_version, update_definitions},
    },
    helpers::{
        flags::parse_startup_flags,
        scan::run_headless_scan,
        sys_tray::{generate_system_tray, SHOULD_QUIT},
        i18n::{load_translations,TRANSLATIONS}
    },
    system::{
        check_availability,
        set_language,
        rebuild_tray,
        logs::{read_log, reveal_log},
        remove_file,
        scheduler::{
            clear_scheduled_jobs, list_scheduler, remove_scheduled_task, run_job_now, schedule_task,
        },
        sysinfo::{get_sys_info, get_sys_stats},
    },
    types::structs::AppLanguage
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let scan_flag = parse_startup_flags();
    if scan_flag.is_scheduled {
        if let Err(e) = run_headless_scan(scan_flag) {
            eprintln!("Failed to run a headless scan: {}", e.to_string());
        }
        std::process::exit(0);
    }

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
        run_job_now,
        clear_scheduled_jobs,
        start_real_time_scan,
        stop_real_time_scan,
        set_language,
        rebuild_tray
    ]);

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            use tauri::{Manager, WindowEvent};
            let app_handle = app.handle();
            let default = load_translations(&app_handle.clone(),"en");
            {
                let mut guard = TRANSLATIONS.write().unwrap();
                *guard = default;
            }
            if let Some(window) = app.get_webview_window("main") {
                window.clone().on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { api, .. } = event {
                        if !SHOULD_QUIT.load(Ordering::Relaxed) {
                            api.prevent_close();
                            let _ = window.hide();
                        }
                    }
                });
            }
            generate_system_tray(app_handle)?;
            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .manage(AppLanguage(Mutex::new("en".into())))
        .manage(scan_flag.clone())
        .invoke_handler(specta_builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
