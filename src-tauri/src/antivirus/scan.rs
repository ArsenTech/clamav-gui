use specta::specta;
use std::io::{BufRead as _, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use tauri::{command, Emitter};
use walkdir::WalkDir;

use crate::types::enums::{LogCategory,HistoryStatus};
use crate::types::structs::HistoryItem;
use crate::antivirus::history::append_history;
use crate::system::logs::{log_path, log_err, log_info};
use crate::system::new_id;

fn estimate_total_files(paths: &[PathBuf]) -> u64 {
    paths
        .iter()
        .flat_map(|p| WalkDir::new(p).into_iter())
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
        .count() as u64
}

static SCAN_PROCESS: once_cell::sync::Lazy<Mutex<Option<u32>>> =
    once_cell::sync::Lazy::new(|| Mutex::new(None));

fn run_scan(app: tauri::AppHandle, log_id: String, mut cmd: Command) -> Result<(), String> {
    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        if guard.is_some() {
            return Err("Scan already running".into());
        }
        *guard = Some(0);
    }

    let log_path = log_path(&app, LogCategory::Scan, &log_id);
    let log_file = Arc::new(Mutex::new(
        std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
            .map_err(|e| e.to_string())?,
    ));

    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = Some(child.id());
    }

    let threats_count = Arc::new(AtomicUsize::new(0));

    if let Some(out) = child.stdout.take() {
        let app = app.clone();
        let log = log_file.clone();
        let threats = threats_count.clone();
        std::thread::spawn(move || {
            for line in BufReader::new(out).lines().flatten() {
                if line.ends_with("FOUND") {
                    threats.fetch_add(1, Ordering::Relaxed);
                }
                app.emit("clamscan:log", &line).ok();
                log_info(&log, &line);
            }
        });
    }

    if let Some(err) = child.stderr.take() {
        let app = app.clone();
        let log = log_file.clone();
        std::thread::spawn(move || {
            for line in BufReader::new(err).lines().flatten() {
                app.emit("clamscan:log", &line).ok();
                log_err(&log, &line);
            }
        });
    }

    let exit_code = child.wait().ok().and_then(|s| s.code()).unwrap_or(-1);

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = None;
    }
    let found = threats_count.load(Ordering::Relaxed);

    let (status, details) = match exit_code {
        0 => (
            HistoryStatus::Success,
            "Scan completed successfully, no threats found".to_string(),
        ),
        1 => (
            HistoryStatus::Warning,
            format!("Scan completed successfully, {} threats found", found),
        ),
        2 => (
            HistoryStatus::Success,
            "Some files could not be scanned due to access restrictions".to_string(),
        ),
        _ => (
            HistoryStatus::Error,
            format!("Scan failed (exit code {})", exit_code)
        ),
    };

    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Finished".into(),
            details,
            status,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
        },
    ) {
        eprintln!("History append failed: {}", e);
    }
    app.emit("clamscan:finished", exit_code).ok();
    Ok(())
}

#[command]
#[specta(result)]
pub async fn start_main_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    println!("Starting Main Scan...");
    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The main scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
        },
    ) {
        eprintln!("History append failed: {}", e);
    }
    std::thread::spawn(move || {
        let mut paths = Vec::new();

        if cfg!(windows) {
            if let Some(home) = std::env::var_os("USERPROFILE") {
                let home = PathBuf::from(home);
                paths.extend([
                    home.join("Downloads"),
                    home.join("Desktop"),
                    home.join("Documents"),
                ]);
            }
        } else if let Some(home) = std::env::var_os("HOME") {
            let home = PathBuf::from(home);
            paths.extend([
                home.join("Downloads"),
                home.join("Desktop"),
                home.join("Documents"),
            ]);
        }

        let mut cmd = Command::new("clamscan");

        cmd.args([
            "--recursive",
            "--heuristic-alerts",
            "--alert-encrypted",
            "--max-filesize=100M",
            "--max-scansize=400M",
            "--verbose",
            "--no-summary",
        ]);

        let total_files = estimate_total_files(&paths);
        app.emit("clamscan:total", total_files).ok();

        for path in paths {
            cmd.arg(path);
        }

        run_scan(app, log_id, cmd).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub async fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The full scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
        },
    ) {
        eprintln!("History append failed: {}", e);
    }
    println!("Starting Full Scan...");
    std::thread::spawn(move || {
        let root = if cfg!(windows) { "C:\\" } else { "/" };

        let mut cmd = Command::new("clamscan");
        cmd.args([
            "--recursive",
            "--cross-fs=yes",
            "--heuristic-alerts",
            "--alert-encrypted",
            "--no-summary",
            root,
        ]);

        run_scan(app, log_id, cmd).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_custom_scan(app: tauri::AppHandle, paths: Vec<String>) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No scan targets provided".into());
    }
    let log_id = new_id();
    println!("Starting Custom Scan...");
    if let Err(e) = append_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The custom scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
        },
    ) {
        eprintln!("History append failed: {}", e);
    }
    let resolved_paths: Vec<PathBuf> = paths.iter().map(PathBuf::from).collect();

    for path in &resolved_paths {
        if !path.try_exists().unwrap_or(false) {
            return Err("Path does not exist".into());
        }

        if !path.is_file() && !path.is_dir() {
            return Err("Invalid scan target".into());
        }
    }

    let has_directory = resolved_paths.iter().any(|p| p.is_dir());
    let app = app.clone();

    std::thread::spawn(move || {
        let mut cmd = Command::new("clamscan");

        if has_directory {
            cmd.arg("--recursive");
        }

        cmd.args([
            "--heuristic-alerts",
            "--alert-encrypted",
            "--max-filesize=100M",
            "--max-scansize=400M",
            "--verbose",
            "--no-summary",
        ]);

        for path in &resolved_paths {
            cmd.arg(path);
        }

        let total_files = estimate_total_files(&resolved_paths);
        app.emit("clamscan:total", total_files).ok();

        run_scan(app, log_id, cmd).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn stop_scan() -> Result<(), String> {
    let pid = {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        guard.take()
    };

    if let Some(pid) = pid {
        #[cfg(windows)]
        {
            Command::new("taskkill")
                .args(["/PID", &pid.to_string(), "/F"])
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        #[cfg(unix)]
        {
            Command::new("kill")
                .arg("-9")
                .arg(pid.to_string())
                .spawn()
                .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
