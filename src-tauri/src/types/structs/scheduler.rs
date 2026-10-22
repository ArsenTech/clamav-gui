use serde::{Deserialize, Serialize};
use specta::Type;
use crate::types::enums::{
    DayOfTheWeek, antivirus::ScanType, SchedulerInterval
};

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