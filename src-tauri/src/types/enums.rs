use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ScanResult {
    Clean,
    ThreatsFound,
    Partial,
    Failed,
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
impl ScanType{
    pub fn from_str(val: &str) -> Result<ScanType,String>{
        match val{
            "main" => Ok(ScanType::Main),
            "full" => Ok(ScanType::Full),
            "custom" => Ok(ScanType::Custom),
            "file" => Ok(ScanType::File),
            "realtime" => Ok(ScanType::Realtime),
            "scheduled" => Ok(ScanType::Scheduled),
            &_ => Err("Unknown Scan Type".into())
        }
    }
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

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum HistoryStatus {
    Success,
    Warning,
    Error,
    Acknowledged,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy, PartialEq, Eq, Hash)]
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

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum SchedulerInterval {
    Daily,
    Weekly,
    Monthly,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum DayOfTheWeek {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat,
    Sun,
}
impl DayOfTheWeek {
    pub fn as_str(&self) -> &'static str {
        match self {
            DayOfTheWeek::Mon => "mon",
            DayOfTheWeek::Tue => "tue",
            DayOfTheWeek::Wed => "wed",
            DayOfTheWeek::Thu => "thu",
            DayOfTheWeek::Fri => "fri",
            DayOfTheWeek::Sat => "sat",
            DayOfTheWeek::Sun => "sun",
        }
    }
}

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum ClearHistoryMode {
    All,
    Acknowledged,
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "lowercase")]
pub enum BehaviorMode {
    Balanced,
    Safe,
    Strict,
    Expert,
}