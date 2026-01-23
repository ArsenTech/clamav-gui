use std::{fs::File, sync::{Arc,Mutex}};
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::types::enums::{
     ThreatStatus,
     ComputerVirusType,
     ScanType,
     HistoryStatus,
     LogCategory  
};

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ActivityStat{
     pub month: String,
     pub unresolved: u32,
     pub resolved: u32,
     pub threats: u32,
     pub fill: String,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ScanTypeStat{
     pub scan_type: ScanType,
     pub threats: u32,
     pub fill: String,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct ThreatStatusStat{
     pub status: ThreatStatus,
     pub threats: u32,
     pub fill: String,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct VirusTypeStat{
     pub virus_type: ComputerVirusType,
     pub threats: u32,
     pub fill: String,
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct StatItem {
     pub activity: Vec<ActivityStat>,
     pub scan_types: Vec<ScanTypeStat>,
     pub threat_status: Vec<ThreatStatusStat>,
     pub virus_types: Vec<VirusTypeStat>
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
     pub file: Arc<Mutex<File>>
}

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct QuarantinedItem {
     pub id: String,
     pub threat_name: String,
     pub file_path: String,
     pub quarantined_at: String,
     pub size: u64,
}