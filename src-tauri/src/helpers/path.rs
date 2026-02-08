//use std::path::Path;

use std::path::PathBuf;

use crate::helpers::resolve_command;

#[cfg(windows)]
fn normalize_path(path: &str) -> String {
    path.replace('\\', r"\\")
}

#[cfg(not(windows))]
fn normalize_path(path: &str) -> String {
    path.to_string()
}

/// Convert a filesystem path into a safe, anchored regex
/// usable by ClamAV and the realtime exclusion matcher.
pub fn path_to_regex(path: &str) -> String {
    // Escape regex metacharacters
    let escaped = regex::escape(path);

    // Platform-specific normalization
    let normalized = normalize_path(&escaped);

    // Anchor to start
    format!("^{}", normalized)
}

// Convenience helper when you already have a Path
// pub fn pathbuf_to_regex(path: &Path) -> String {
//     path_to_regex(&path.to_string_lossy())
// }

pub fn get_clamav_path() -> Result<PathBuf,String>{
    if let Ok(clamscan) = resolve_command("clamscan"){
        #[cfg(debug_assertions)]
        println!("Using clamscan: {}",clamscan.display().to_string());

        return Ok(clamscan);
    };
    Err("ClamAV not found. Please install ClamAV and ensure clamscan is available in PATH.".into())
}