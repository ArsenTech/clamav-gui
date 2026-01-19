use specta::specta;
use std::io::{BufRead as _, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::Mutex;
use tauri::{command, Emitter};
use walkdir::WalkDir;

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

fn run_scan(app: tauri::AppHandle, mut cmd: Command) -> Result<(), String> {
    {
        let guard = SCAN_PROCESS.lock().unwrap();
        if guard.is_some() {
            return Err("Scan already running".into());
        }
    }

    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take();
    let stderr = child.stderr.take();

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = Some(child.id());
    }

    let app_out = app.clone();
    if let Some(out) = stdout {
        std::thread::spawn(move || {
            for line in BufReader::new(out).lines().flatten() {
                app_out.emit("clamscan:log", line).ok();
            }
        });
    }

    let app_err = app.clone();
    if let Some(err) = stderr {
        std::thread::spawn(move || {
            for line in BufReader::new(err).lines().flatten() {
                app_err.emit("clamscan:log", line).ok();
            }
        });
    }

    let success = child.wait().map(|s| s.success()).unwrap_or(false);

    {
        let mut guard = SCAN_PROCESS.lock().unwrap();
        *guard = None;
    }

    app.emit("clamscan:finished", success).ok();
    Ok(())
}

#[command]
#[specta(result)]
pub async fn start_main_scan(app: tauri::AppHandle) -> Result<(), String> {
    println!("Starting Main Scan...");
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

        run_scan(app, cmd).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub async fn start_full_scan(app: tauri::AppHandle) -> Result<(), String> {
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

        run_scan(app, cmd).ok();
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn start_custom_scan(app: tauri::AppHandle, paths: Vec<String>) -> Result<(), String> {
    if paths.is_empty() {
        return Err("No scan targets provided".into());
    }
    println!("Starting Custom Scan...");
    let resolved_paths: Vec<PathBuf> = paths
        .iter()
        .map(PathBuf::from)
        .collect();

    for path in &resolved_paths {
        if !path.exists() {
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

        for path in &resolved_paths{
            cmd.arg(path);
        }

        let total_files = estimate_total_files(&resolved_paths);
        app.emit("clamscan:total", total_files).ok();

        run_scan(app, cmd).ok();
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