use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
    fs::File,
    sync::{Arc, Mutex},
};
use crate::types::enums::{
    history::{HistoryStatus, HistoryType, LogCategory, HistoryDetails},
    antivirus::{ScanResult, ScanType}
};

#[derive(Debug, Serialize, Type, Deserialize)]
pub struct HistoryItem {
    pub id: String,
    pub timestamp: String,
    pub action: Option<HistoryType>,
    pub details: Option<HistoryDetails>,
    pub status: HistoryStatus,
    pub category: Option<LogCategory>,
    pub log_id: Option<String>,
    pub scan_type: Option<ScanType>,
    pub threat_count: Option<u32>,
    pub scan_result: Option<ScanResult>,
}

pub struct InitLog {
    pub id: String,
    pub file: Arc<Mutex<File>>,
}