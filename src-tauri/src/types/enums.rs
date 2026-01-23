use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ScanType{
     Main,
     Full,
     Custom,
     File,
     Realtime 
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ThreatStatus{
     Quarantined,
     Deleted,
     Skipped,
     Unresolved
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ComputerVirusType{
     Trojan,
     Ransomware,
     Spyware,
     Rootkit,
     Other,
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum HistoryStatus {
    Success,
    Warning,
    Error,
    Acknowledged,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy)]
#[serde(rename_all = "lowercase")]
pub enum LogCategory {
    Scan,
    Update,
    Quarantine,
    Realtime,
    Scheduler,
}
impl LogCategory {
     pub fn as_str(&self) -> &'static str {
          match self {
               LogCategory::Scan => "scan",
               LogCategory::Update => "update",
               LogCategory::Quarantine => "quarantine",
               LogCategory::Realtime => "realtime",
               LogCategory::Scheduler => "scheduler",
          }
     }
}