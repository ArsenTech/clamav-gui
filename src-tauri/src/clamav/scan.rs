use tauri::{Emitter, command};
use specta::specta;
use std::process::Command;
use std::path::PathBuf;

#[command]
#[specta(result)]
pub fn start_main_scan(window: tauri::Window) -> Result<(), String> {
     let mut paths: Vec<PathBuf> = Vec::new();

     if cfg!(windows) {
          if let Some(home) = std::env::var_os("USERPROFILE") {
               let home = PathBuf::from(home);
               paths.push(home.join("Downloads"));
               paths.push(home.join("Desktop"));
               paths.push(home.join("Documents"));
          }
     } else {
          if let Some(home) = std::env::var_os("HOME") {
               let home = PathBuf::from(home);
               paths.push(home.join("Downloads"));
               paths.push(home.join("Desktop"));
               paths.push(home.join("Documents"));
          }
     }

     let mut cmd = Command::new("clamscan");
     cmd.arg("--log=scan.log")
          .arg("--recursive")
          .arg("--heuristic-alerts=yes")
          .arg("--alert-encrypted=yes")
          .arg("--max-filesize=100M")
          .arg("--max-scansize=400M");

     for path in paths {
          cmd.arg(path);
     }

     std::thread::spawn(move || {
          use std::fs::File;
          use std::io::{BufRead, BufReader};
          use std::thread::sleep;
          use std::time::Duration;

          let file = File::open("scan.log").unwrap();
          let mut reader = BufReader::new(file);

          loop {
               let mut line = String::new();
               if reader.read_line(&mut line).unwrap() > 0 {
                    window.emit("clamav:log", line).ok();
               } else {
                    sleep(Duration::from_millis(500));
               }
          }
     });
     Ok(())
}

#[command]
#[specta(result)]
pub fn start_full_scan() -> Result<(), String> {
     let root = if cfg!(windows) { "C:\\" } else { "/" };

     Command::new("clamscan")
          .arg("--log=scan.log")
          .arg("--recursive")
          .arg("--cross-fs=yes")
          .arg("--heuristic-alerts=yes")
          .arg("--alert-encrypted=yes")
          .arg(root)
          .spawn()
          .map_err(|e| e.to_string())?;

     Ok(())
}