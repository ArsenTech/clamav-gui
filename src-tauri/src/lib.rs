use std::process::Command;
use sysinfo::{System, ProcessesToUpdate};
use tauri::command;
use serde::Serialize;

#[derive(Serialize)]
struct SysStats{
    cpu_usage: Vec<f32>,
    cpu_frequency: Vec<u64>,

    ram_used: u64,
    ram_total: u64,

    disk_read_bytes: u64,
    disk_written_bytes: u64,
}

#[derive(Serialize)]
struct SysInfo{
    sys_name: Option<String>,
    sys_os: Option<String>,
    sys_host: Option<String>,
}

#[command]
fn check_availability() -> bool {
    let command = if cfg!(windows) { "where" } else { "which" };
    let output = Command::new(command).arg("clamscan").output();

    match output {
        Ok(result) => !result.stdout.is_empty(),
        Err(_) => false,
    }
}

#[command]
fn get_sys_stats() -> SysStats {
    let mut system = System::new_all();

    system.refresh_cpu_all();
    system.refresh_memory();
    system.refresh_processes(ProcessesToUpdate::All, true);

    let cpu_usage = system
        .cpus()
        .iter()
        .map(|cpu| cpu.cpu_usage())
        .collect();

    let cpu_frequency = system
        .cpus()
        .iter()
        .map(|cpu| cpu.frequency()) // MHz (base)
        .collect();

    let ram_used = system.used_memory();
    let ram_total = system.total_memory();

    // Aggregate disk IO from processes (bytes, not ratios)
    let mut disk_read_bytes = 0;
    let mut disk_written_bytes = 0;

    for process in system.processes().values() {
        let io = process.disk_usage();
        disk_read_bytes += io.read_bytes;
        disk_written_bytes += io.written_bytes;
    }

    SysStats {
        cpu_usage,
        cpu_frequency,

        ram_used,
        ram_total,

        disk_read_bytes,
        disk_written_bytes,
    }
}

#[command]
fn get_sys_info() -> SysInfo{
    SysInfo {
        sys_name: System::name(),
        sys_os: System::os_version(),
        sys_host: System::host_name(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_availability, get_sys_stats, get_sys_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
