use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{
    menu::{MenuBuilder, MenuItem, SubmenuBuilder},
    tray::{TrayIcon, TrayIconBuilder},
    Emitter, Manager,
};
use tauri_plugin_dialog::DialogExt;
use crate::{helpers::i18n::t};

pub static SHOULD_QUIT: AtomicBool = AtomicBool::new(false);

pub fn generate_system_tray(app: &tauri::AppHandle) -> Result<TrayIcon, tauri::Error> {
    let quit = MenuItem::with_id(app, "quit", t("tray.quit"), true, None::<&str>)?;
    let about = MenuItem::with_id(app, "about", t("tray.about"), true, None::<&str>)?;
    let open_ui = MenuItem::with_id(app, "open-ui", t("tray.open"), true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", t("tray.settings"), true, None::<&str>)?;
    let update = MenuItem::with_id(app, "update", t("tray.update"), true, None::<&str>)?;

    let main_scan = MenuItem::with_id(app, "main-scan", t("tray.scan.main"), true, None::<&str>)?;
    let full_scan = MenuItem::with_id(app, "full-scan", t("tray.scan.full"), true, None::<&str>)?;
    let custom_scan = MenuItem::with_id(app, "custom-scan", t("tray.scan.custom"), true, None::<&str>)?;
    let file_scan = MenuItem::with_id(app, "file-scan", t("tray.scan.file"), true, None::<&str>)?;

    let scan = SubmenuBuilder::new(app, t("tray.scan.title"))
        .items(&[&main_scan, &full_scan, &custom_scan, &file_scan])
        .build()?;

    let menu = MenuBuilder::new(app)
        .items(&[&open_ui, &about])
        .separator()
        .items(&[&settings, &scan, &update])
        .separator()
        .item(&quit)
        .build()?;

    TrayIconBuilder::with_id("main_tray")
        .tooltip(t("tray.tooltip"))
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app_handle, event| match event.id.as_ref() {
            "quit" => {
                SHOULD_QUIT.store(true, Ordering::Relaxed);
                app_handle.exit(0);
            }
            "about" => {
                app_handle.emit("systray:move", "/about").ok();
            }
            "main-scan" => {
                app_handle.emit("systray:move", "/scan/main").ok();
            }
            "full-scan" => {
                app_handle.emit("systray:move", "/scan/full").ok();
            }
            "custom-scan" => {
                if let Some(folders) = app_handle.dialog().file().blocking_pick_folders() {
                    let paths: Vec<String> = folders
                        .iter()
                        .map(|val| format!("path={}", val.to_string()))
                        .collect();
                    app_handle
                        .emit("systray:move", format!("/scan/custom?{}", paths.join("&")))
                        .ok();
                }
            }
            "file-scan" => {
                if let Some(path) = app_handle.dialog().file().blocking_pick_file() {
                    app_handle
                        .emit(
                            "systray:move",
                            format!("/scan/file?path={}", path.to_string()),
                        )
                        .ok();
                }
            }
            "update" => {
                app_handle.emit("systray:move", "/settings?tab=update").ok();
            }
            "open-ui" => {
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "settings" => {
                app_handle.emit("systray:move", "/settings").ok();
            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .build(app)
}
