use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    fs::File,
    sync::{Arc, Mutex},
};

use crate::types::enums::{
    ComputerVirusType, DayOfTheWeek, HistoryStatus, LogCategory, ScanResult, ScanType,
    SchedulerInterval, ThreatStatus,
};

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ActivityStat {
    pub month: String,
    pub unresolved: u32,
    pub resolved: u32,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ScanTypeStat {
    pub scan_type: ScanType,
    pub threats: u32,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ThreatStatusStat {
    pub status: ThreatStatus,
    pub threats: u32,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct VirusTypeStat {
    pub virus_type: ComputerVirusType,
    pub threats: u32,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct StatsResponse {
    pub activity: Vec<ActivityStat>,
    pub scan_types: Vec<ScanTypeStat>,
    pub threat_status: Vec<ThreatStatusStat>,
    pub virus_types: Vec<VirusTypeStat>,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct HistoryItem {
    pub id: String,
    pub timestamp: String,
    pub action: String,
    pub details: String,
    pub status: HistoryStatus,
    pub category: Option<LogCategory>,
    pub log_id: Option<String>,
    pub scan_type: Option<ScanType>,
    pub threat_count: Option<u32>,
    pub scan_result: Option<ScanResult>,
}

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

pub struct InitLog {
    pub id: String,
    pub file: Arc<Mutex<File>>,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct QuarantinedItem {
    pub id: String,
    pub threat_name: String,
    pub file_path: String,
    pub quarantined_at: String,
    pub size: u64,
}

#[derive(Clone, Serialize, Type)]
pub struct StartupScan {
    pub scan_type: Option<ScanType>,
    pub is_startup: bool,
    pub is_scheduled: bool,
}

#[derive(Serialize, Clone, Type)]
pub struct SchedulerEvent {
    pub id: String,
    pub interval: SchedulerInterval,
    pub scan_type: ScanType,
    pub days: DayOfTheWeek,
    pub time: String,
    pub log_id: Option<String>,
    pub last_run: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct SchedulerFile {
    pub version: u8,
    pub schedulers: Vec<SchedulerEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct SchedulerEntry {
    pub id: String,
    pub scan_type: ScanType,
    pub interval: SchedulerInterval,
    pub days: DayOfTheWeek,
    pub time: String,
    pub enabled: bool,
    pub last_run: Option<String>,
    pub created_at: String,
    pub log_id: Option<String>,
}
