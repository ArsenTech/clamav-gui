use crate::types::enums::ScanType;
use std::env;

pub fn parse_flags() -> Option<ScanType> {
    for arg in env::args() {
        if let Some(scan) = arg.strip_prefix("--scan=") {
            return match scan {
                "main" => Some(ScanType::Main),
                "full" => Some(ScanType::Full),
                _ => None,
            };
        }
    }
    None
}
