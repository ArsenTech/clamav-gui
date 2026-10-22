use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "kebab-case")]
pub enum ScanResult {
    Clean,
    ThreatsFound,
    Partial,
    Failed,
    ClamavError
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ScanType {
    Main,
    Full,
    Custom,
    File,
    Realtime,
    Scheduled,
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum ThreatStatus {
    Quarantined,
    Deleted,
    Unresolved,
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum ComputerVirusType {
    Trojan,
    Ransomware,
    Spyware,
    Rootkit,
    Other,
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "lowercase")]
pub enum BehaviorMode {
    Balanced,
    Safe,
    Strict,
    Expert,
}