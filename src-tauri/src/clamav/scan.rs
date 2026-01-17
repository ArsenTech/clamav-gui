use tauri::{command, Emitter};
use specta::specta;
use std::path::PathBuf;
use std::process::{Stdio, Command};
use std::io::{BufRead as _, BufReader};

#[command]
#[specta(result)]
pub async fn start_main_scan(app: tauri::AppHandle) -> Result<(), String> {
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
     cmd.arg("--recursive")
          .arg("--heuristic-alerts")
          .arg("--alert-encrypted")
          .arg("--max-filesize=100M")
          .arg("--max-scansize=400M")
          .arg("--verbose")
          .arg("--stdout")
          .arg("--no-summary");

     for path in paths {
          cmd.arg(path);
     }

     let mut child = cmd.stdout(Stdio::piped())
          .stderr(Stdio::piped())
          .spawn()
          .map_err(|e| e.to_string())?;

     let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
     let reader = BufReader::new(stdout);

     for line in reader.lines() {
          match line{
               Ok(text) => {
                    app.emit("clamav-scan-log",text).map_err(|e| e.to_string())?;
               }
               Err(e)=>{
                    app.emit("clamav-scan-error",e.to_string()).map_err(|e| e.to_string())?;
               }
          }
     }

     Ok(())
}

#[command]
#[specta(result)]
pub async fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
     let root = if cfg!(windows) { "C:\\" } else { "/" };

     let mut cmd = Command::new("clamscan");
     cmd.arg("--log=scan.log")
          .arg("--recursive")
          .arg("--cross-fs=yes")
          .arg("--heuristic-alerts=yes")
          .arg("--alert-encrypted=yes")
          .arg("--no-summary")
          .arg(root);

     let mut child = cmd.stdout(Stdio::piped())
          .stderr(Stdio::piped())
          .spawn()
          .map_err(|e| e.to_string())?;

     let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
     let reader = BufReader::new(stdout);

     for line in reader.lines() {
          match line{
               Ok(text) => {
                    app.emit("clamav-scan-log",text).map_err(|e| e.to_string())?;
               }
               Err(e)=>{
                    app.emit("clamav-scan-error",e.to_string()).map_err(|e| e.to_string())?;
               }
          }
     }

     Ok(())
}