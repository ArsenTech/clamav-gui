use crate::types::{enums::ScanType, structs::StartupScan};

pub fn parse_startup_flags() -> StartupScan {
    let mut scan_type = None;
    let mut is_scheduled = false;
    for arg in std::env::args() {
        if arg == "--scheduled" {
            is_scheduled = true;
        }
        if let Some(value) = arg.strip_prefix("--scan=") {
            scan_type = match value {
                "main" => Some(ScanType::Main),
                "full" => Some(ScanType::Full),
                _ => None,
            };
        }
    }
    StartupScan {
        scan_type,
        is_scheduled,
        is_startup: scan_type.is_some(),
    }
}
