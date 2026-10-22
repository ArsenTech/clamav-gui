use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::Mutex;
use crate::types::enums::{
    antivirus::ScanType
};

pub mod stats;
pub mod scheduler;
pub mod history;

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

#[derive(Debug, Serialize, Type)]
pub struct BehaviorConfig {
    pub scan_extensions: Vec<&'static str>,
    pub auto_quarantine: bool,
    pub rescan_on_modify: bool,
}

pub struct AppLanguage(pub Mutex<String>);