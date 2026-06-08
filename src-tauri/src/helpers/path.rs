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
    #[cfg(debug_assertions)]
    {
        println!("PATH={:?}", std::env::var("PATH"));
    }
    match resolve_command("clamscan") {
        Ok(path) => {
            #[cfg(debug_assertions)]
            println!("clamscan={:?}", path);
            Ok(path)
        }
        Err(err) => {
            #[cfg(debug_assertions)]
            println!("clamscan lookup failed: {}", err);
            Err("ClamAV not found. Please install ClamAV and ensure clamscan is available in PATH, or report the bug if something went wrong.".into())
        }
    }
}