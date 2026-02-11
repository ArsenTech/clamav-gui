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
    Error
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "lowercase")]
pub enum BehaviorMode {
    Balanced,
    Safe,
    Strict,
    Expert,
}

#[derive(Serialize, Deserialize, Type, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[serde(rename_all = "kebab-case")]
pub enum HistoryType{
    RealTimeError,
    RealTimeStart,
    RealTimeStop,
    QuarantineThreat,
    RestoreThreat,
    DeleteThreat,
    ScanStart,
    ScanFinish,
    DefUpdateStart,
    DefUpdateFinish,
    DefUpdateError,
    SchedulerCreate,
    SchedulerDelete,
    SchedulerTrigger,
    FileDelete,
    FileDeleteError
}

#[derive(Debug, Serialize, Deserialize, Type)]
#[serde(tag = "type", content = "details", rename_all = "kebab-case")]
pub enum HistoryDetails{
    RealTimeError {err: String},
    RealTimeStart {behavior: BehaviorMode, paths: usize},
    RealTimeStop,
    QuarantineThreat {threat: String},
    RestoreThreat {threat: String},
    DeleteThreat {threat: String},
    ScanStart {scan_type: ScanType},
    ScanFinish {result: ScanResult, exit_code: i32, found_threats: usize},
    DefUpdateStart,
    DefUpdateFinish {exit_code: i32},
    DefUpdateError {err: String},
    SchedulerCreate {task_name: String},
    SchedulerDelete {task_name: String},
    SchedulerTrigger {task_name: String},
    SchedulerTriggerError {task_name: String},
    FileDelete {file_path: String},
    FileDeleteError {err: String, file_path: String}
}