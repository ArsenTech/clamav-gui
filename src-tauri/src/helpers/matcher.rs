use std::{
    path::Path,
    sync::{Arc, Mutex},
};

use once_cell::sync::Lazy;
use regex::Regex;

use crate::types::enums::SettingKeyArray;

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
pub const DEFAULT_LINUX_EXCLUDED_DIRS: &[&str] = &[
    "/proc",
    "/sys",
    "/dev",
    "/run",
];

pub fn apply_exclusions(app: &tauri::AppHandle, args: &mut Vec<String>) -> Result<(), String> {
    use crate::helpers::get_settings_as_array;
    use crate::helpers::path::path_to_regex;

    #[cfg(target_os = "linux")]
    for dir in DEFAULT_LINUX_EXCLUDED_DIRS {
        args.push(format!("--exclude-dir={}", path_to_regex(dir)));
    }

    let exclusions = get_settings_as_array(app,SettingKeyArray::Exclusions)?;

    for item in exclusions.into_iter() {
        let regex = path_to_regex(&item);
        args.push(format!("--exclude-dir={}", regex));
    }
    Ok(())
}
