use sysinfo::{System, ProcessesToUpdate};
use tauri::command;
use serde::Serialize;
use specta::{specta, Type};

#[derive(Debug, Serialize, Type)]
pub struct SysStats {
     pub cpu_usage: Vec<f32>,
     pub cpu_frequency: Vec<u64>,

     pub ram_used: u64,
     pub ram_total: u64,

     pub disk_read_bytes: u64,
     pub disk_written_bytes: u64,
}

#[derive(Debug, Serialize, Type)]
pub struct SysInfo {
     pub sys_name: Option<String>,
     pub sys_os: Option<String>,
     pub sys_host: Option<String>,
}

#[command]
#[specta(result)]
pub fn get_sys_stats() -> Result<SysStats, String> {
     let mut system = System::new_all();

     system.refresh_cpu_all();
     system.refresh_memory();
     system.refresh_processes(ProcessesToUpdate::All, true);

     let cpu_usage = system.cpus().iter().map(|c| c.cpu_usage()).collect();
     let cpu_frequency = system.cpus().iter().map(|c| c.frequency()).collect();

     let ram_used = system.used_memory();
     let ram_total = system.total_memory();

     let mut disk_read_bytes = 0;
     let mut disk_written_bytes = 0;

     for process in system.processes().values() {
          let io = process.disk_usage();
          disk_read_bytes += io.read_bytes;
          disk_written_bytes += io.written_bytes;
     }

     Ok(SysStats {
          cpu_usage,
          cpu_frequency,
          ram_used,
          ram_total,
          disk_read_bytes,
          disk_written_bytes,
     })
}

#[command]
#[specta(result)]
pub fn get_sys_info() -> Result<SysInfo, String> {
     Ok(SysInfo {
          sys_name: System::name(),
          sys_os: System::os_version(),
          sys_host: System::host_name(),
     })
}