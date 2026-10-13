use std::{
    path::Path,
    sync::{Arc, Mutex},
};

use once_cell::sync::Lazy;
use regex::Regex;

use crate::types::enums::{SettingKeyArray, SettingKeyBool};

#[derive(Clone)]
pub struct ExclusionMatcher {
    pub regexes: Vec<Regex>,
}
impl ExclusionMatcher {
    pub fn new(patterns: Vec<String>) -> Result<Self, regex::Error> {
        let regexes = patterns
            .into_iter()
            .map(|p| Regex::new(&p))
            .collect::<Result<Vec<_>, _>>()?;

        Ok(Self { regexes })
    }
    pub fn is_excluded(&self, path: &Path) -> bool {
        let path_str = path.to_string_lossy();
        self.regexes.iter().any(|r| r.is_match(&path_str))
    }
}

pub static EXCLUSIONS: Lazy<Arc<Mutex<Option<ExclusionMatcher>>>> =
    Lazy::new(|| Arc::new(Mutex::new(None)));


#[cfg(target_os = "linux")]
const DEFAULT_LINUX_EXCLUDED_DIRS: &[&str] = &[
    "/proc",
    "/sys",
    "/dev",
    "/run",
];
#[cfg(target_os = "macos")]
pub const DEFAULT_MACOS_EXCLUDED_DIRS: &[&str] = &[
    "/System/Library/PrivateFrameworks/TextToSpeech.framework",
];

pub fn apply_exclusions(app: &tauri::AppHandle, args: &mut Vec<String>) -> Result<(), String> {
    use crate::helpers::settings::{get_settings_as_array, get_settings_as_bool};
    use crate::helpers::path::path_to_regex;

    #[cfg(target_os = "linux")]
    for dir in DEFAULT_LINUX_EXCLUDED_DIRS {
        args.push(format!("--exclude-dir={}", path_to_regex(dir)));
    }

    #[cfg(target_os = "macos")]
    {
        let include_mac_exclusions =
            get_settings_as_bool(app, SettingKeyBool::IncludeMacSystemExclusions)
                .unwrap_or(false);

        if include_mac_exclusions {
            for dir in DEFAULT_MACOS_EXCLUDED_DIRS {
                args.push(format!("--exclude-dir={}", path_to_regex(dir)));
            }
        }
    }

    let exclusions = get_settings_as_array(app,SettingKeyArray::Exclusions)?;

    for item in exclusions.into_iter() {
        let regex = path_to_regex(&item);
        args.push(format!("--exclude-dir={}", regex));
    }
    Ok(())
}
