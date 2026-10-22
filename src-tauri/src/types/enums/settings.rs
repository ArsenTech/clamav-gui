use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "camelCase")]
pub enum SettingKeyArray{
    Exclusions,
    MonitoringPaths
}
impl SettingKeyArray {
    pub fn as_str(&self) -> &'static str {
        match self {
            SettingKeyArray::Exclusions => "exclusions",
            SettingKeyArray::MonitoringPaths => "monitoringPaths",
        }
    }
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "camelCase")]
#[cfg(target_os = "macos")]
pub enum SettingKeyBool {
    IncludeMacSystemExclusions,
}

#[cfg(target_os = "macos")]
impl SettingKeyBool {
    pub fn as_str(&self) -> &'static str {
        match self {
            SettingKeyBool::IncludeMacSystemExclusions => "includeMacSystemExclusions",
        }
    }
}

#[derive(Serialize, Deserialize, Type, Debug, PartialEq, Eq, Hash, Copy, Clone)]
#[serde(rename_all = "camelCase")]
pub enum SettingKeyString {
    CloseButtonBehavior,
}

impl SettingKeyString {
    pub fn as_str(&self) -> &'static str {
        match self {
            SettingKeyString::CloseButtonBehavior => "closeButtonBehavior",
        }
    }
}