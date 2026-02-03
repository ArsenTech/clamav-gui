use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{
     App, Emitter, Manager, menu::{MenuBuilder, MenuItem, SubmenuBuilder}, tray::{TrayIcon, TrayIconBuilder}
};
use tauri_plugin_dialog::DialogExt;

pub static SHOULD_QUIT: AtomicBool = AtomicBool::new(false);

pub fn generate_system_tray(app: &mut App) -> Result<TrayIcon,tauri::Error>{
     let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
     let about = MenuItem::with_id(app, "about", "About ClamAV GUI", true, None::<&str>)?;
     let open_ui = MenuItem::with_id(app, "open-ui", "Open the GUI",true,None::<&str>)?;
     let settings = MenuItem::with_id(app, "settings", "GUI Settings", true, None::<&str>)?;

     let main_scan = MenuItem::with_id(app, "main-scan", "Start Main Scan", true, None::<&str>)?;
     let full_scan = MenuItem::with_id(app, "full-scan", "Start Full Scan", true, None::<&str>)?;
     let custom_scan = MenuItem::with_id(app, "custom-scan", "Start Custom Scan", true, None::<&str>)?;
     let file_scan = MenuItem::with_id(app, "file-scan", "Start File Scan", true, None::<&str>)?;

     let update_definitions = MenuItem::with_id(app, "update-definitions", "Definitions",true,None::<&str>)?;
     // TODO: Implement Updater
     let update_app = MenuItem::with_id(app, "update-app", "Application",true,None::<&str>)?;
     
     let scan = SubmenuBuilder::new(app, "Scan")
          .items(&[
               &main_scan,
               &full_scan,
               &custom_scan,
               &file_scan
          ])
          .build()?;

     let update = SubmenuBuilder::new(app,"Update")
          .items(&[
               &update_definitions,
               &update_app
          ])
          .build()?;

     let menu = MenuBuilder::new(app)
          .items(&[
               &open_ui,
               &about,
          ])
          .separator()
          .items(&[
               &settings,
               &scan,
               &update,
          ])
          .separator()
          .item(&quit)
          .build()?;

     TrayIconBuilder::new()
          .tooltip("ClamAV GUI is running in the system tray")
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
          },
          "main-scan" => {
               app_handle.emit("systray:move", "/scan/main").ok();
          },
          "full-scan" => {
               app_handle.emit("systray:move", "/scan/full").ok();
          },
          "custom-scan" => {
               if let Some(folders) = app_handle.dialog().file().blocking_pick_folders(){
                    let paths: Vec<String> = folders.iter().map(|val| format!("path={}",val.to_string())).collect();
                    app_handle.emit("systray:move", format!("/scan/custom?{}",paths.join("&"))).ok();
               }
          },
          "file-scan" => {
               if let Some(path) = app_handle.dialog().file().blocking_pick_file() {
                    app_handle.emit("systray:move", format!("/scan/file?path={}",path.to_string())).ok();
               }
          },
          "update-definitions" => {
               app_handle.emit("systray:move", "/update").ok();
          },
          "open-ui" => {
               if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
               }
          },
          "settings" => {
               app_handle.emit("systray:move", "/settings").ok();
          },
          _ => {
               println!("menu item {:?} not handled", event.id);
          }
     })
     .build(app)
}