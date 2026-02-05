//use std::path::Path;

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