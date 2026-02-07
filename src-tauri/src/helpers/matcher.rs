use std::{
    path::Path,
    sync::{Arc, Mutex},
};

use once_cell::sync::Lazy;
use regex::Regex;

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

pub fn apply_exclusions(app: &tauri::AppHandle, args: &mut Vec<String>) -> Result<(), String> {
    use crate::helpers::get_exclusions;
    use crate::helpers::path::path_to_regex;

    let exclusions = get_exclusions(app)?;
    for item in exclusions.into_iter() {
        let regex = path_to_regex(&item);
        args.push(format!("--exclude-dir={}", regex));
    }
    Ok(())
}
