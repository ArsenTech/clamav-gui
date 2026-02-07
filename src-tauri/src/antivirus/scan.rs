use specta::specta;
use std::path::PathBuf;
use tauri::{command, Emitter, Manager};

use crate::{
    helpers::{
        history::append_scan_history,
        log::{initialize_log_with_id, log_err},
        matcher::apply_exclusions,
        new_id, resolve_command,
        scan::{
            estimate_total_files, fetch_custom_scan_args, get_main_paths, get_root_path, run_scan,
            SCAN_PROCESS,
        },
        silent_command,
    },
    types::{
        enums::{HistoryStatus, LogCategory, ScanType},
        structs::{HistoryItem, StartupScan},
    },
};

#[command]
#[specta]
pub fn get_startup_scan(state: tauri::State<StartupScan>) -> StartupScan {
    state.inner().clone()
}

#[command]
#[specta(result)]
pub fn start_main_scan(app: tauri::AppHandle, args: Option<Vec<String>>) -> Result<(), String> {
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
    let log_file = log.file;
    let paths = get_main_paths(app.path());
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The main scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(ScanType::Main),
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );
    let mut scan_args: Vec<String> = if let Some(args) = args {
        args
    } else {
        vec![
            "--recursive".to_string(),
            "--heuristic-alerts".to_string(),
            "--alert-encrypted".to_string(),
            "--max-filesize=100M".to_string(),
            "--max-scansize=400M".to_string(),
            "--verbose".to_string(),
            "--no-summary".to_string(),
        ]
    };
    apply_exclusions(&app, &mut scan_args)?;
    #[cfg(debug_assertions)]
    for arg in scan_args.clone() {
        println!("Main scan argument: {}", arg);
    }
    std::thread::spawn(move || {
        let clamscan = match resolve_command("clamscan") {
            Ok(cmd) => cmd,
            Err(e) => return Err(format!("Failed to resolve command: {}", e)),
        };
        let mut cmd = silent_command(clamscan.to_str().unwrap());
        cmd.args(&scan_args);
        let total_files = estimate_total_files(&paths);
        app.emit("clamscan:total", total_files)
            .map_err(|e| e.to_string())?;
        for path in paths {
            cmd.arg(path);
        }
        if let Err(e) = run_scan(app.clone(), log_id, cmd, ScanType::Main) {
            app.emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string())?;
            log_err(&log_file, &e.to_string());
            Err(e.to_string())
        } else {
            Ok(())
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
    let log_file = log.file;
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The full scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(ScanType::Full),
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );
    let mut args: Vec<String> = vec![
        "--recursive".to_string(),
        "--cross-fs=yes".to_string(),
        "--heuristic-alerts".to_string(),
        "--alert-encrypted".to_string(),
        "--no-summary".to_string(),
    ];
    apply_exclusions(&app, &mut args)?;
    std::thread::spawn(move || {
        let root = get_root_path();
        let clamscan = match resolve_command("clamscan") {
            Ok(cmd) => cmd,
            Err(e) => return Err(format!("Failed to resolve command: {}", e)),
        };
        let mut cmd = silent_command(clamscan.to_str().unwrap());
        cmd.args(&args).arg(root);
        if let Err(e) = run_scan(app.clone(), log_id, cmd, ScanType::Full) {
            app.emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string())?;
            log_err(&log_file, &e.to_string());
            Err(e.to_string())
        } else {
            Ok(())
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_custom_scan(
    app: tauri::AppHandle,
    paths: Vec<String>,
    args: Option<Vec<String>>,
) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No scan targets provided".into());
    }
    let log_id = new_id();
    let log =
        initialize_log_with_id(&app, LogCategory::Scan, &log_id).map_err(|e| e.to_string())?;
    let log_file = log.file;
    let resolved_paths: Vec<PathBuf> = paths.iter().map(PathBuf::from).collect();
    for path in &resolved_paths {
        if !path.try_exists().unwrap_or(false) {
            return Err(format!("Path does not exist: {}", path.display()));
        }
        if !path.is_file() && !path.is_dir() {
            return Err(format!("Invalid scan target: {}", path.display()));
        }
    }

    let has_directory = resolved_paths.iter().any(|p| p.is_dir());
    let scan_type = if has_directory {
        ScanType::Custom
    } else {
        ScanType::File
    };
    append_scan_history(
        &app,
        HistoryItem {
            id: new_id(),
            timestamp: chrono::Utc::now().to_rfc3339(),
            action: "Scan Started".into(),
            details: "The custom scan has been started".into(),
            status: HistoryStatus::Success,
            category: Some(LogCategory::Scan),
            log_id: Some(log_id.clone()),
            scan_type: Some(scan_type),
            threat_count: None,
            scan_result: None,
        },
        &log_file,
    );
    let clamscan = resolve_command("clamscan")?;
    let app_clone = app.clone();
    let mut scan_args: Vec<String> = fetch_custom_scan_args(args, has_directory);
    apply_exclusions(&app, &mut scan_args)?;
    for arg in &scan_args {
        println!(
            "{} scan argument: {}",
            if has_directory { "Custom" } else { "File" },
            arg
        );
    }
    std::thread::spawn(move || {
        let mut cmd = silent_command(clamscan.to_str().unwrap());
        if has_directory {
            cmd.arg("--recursive");
        }
        cmd.args(&scan_args);
        for path in &resolved_paths {
            cmd.arg(path);
        }
        let total_files = estimate_total_files(&resolved_paths);
        let _ = app_clone
            .emit("clamscan:total", total_files)
            .map_err(|e| e.to_string());
        if let Err(e) = run_scan(app_clone.clone(), log_id.clone(), cmd, scan_type) {
            let _ = app_clone
                .emit("clamscan:error", &e.to_string())
                .map_err(|e| e.to_string());
            log_err(&log_file, &e.to_string());
        }
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
            let cmd = resolve_command("taskkill")?;
            silent_command(cmd.to_str().unwrap())
                .args(["/PID", &pid.to_string(), "/F"])
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        #[cfg(unix)]
        {
            let cmd = resolve_command("kill")?;
            silent_command(cmd.to_str().unwrap())
                .arg("-9")
                .arg(pid.to_string())
                .spawn()
                .map_err(|e| e.to_string())?;
        }
        Ok(())
    } else {
        Err("No scan is currently running".into())
    }
}
