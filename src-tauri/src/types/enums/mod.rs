use serde::{Deserialize, Serialize};
use specta::Type;

pub mod settings;
pub mod history;
pub mod antivirus;

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
#[serde(rename_all = "kebab-case")]
pub enum AppendUpdaterErrorType{
    UpdateError,
    CheckError
}