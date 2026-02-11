use crate::{
    antivirus::history::load_history,
    helpers::quarantine::quarantine_dir,
    types::{
        enums::{ComputerVirusType, HistoryType, LogCategory, ScanResult, ScanType, ThreatStatus},
        structs::{
            ActivityStat, HistoryItem, QuarantinedItem, ScanTypeStat, ThreatStatusStat,
            VirusTypeStat,
        },
    },
};
use std::collections::{HashMap, HashSet};

pub fn detect_virus_type(name: &str) -> ComputerVirusType {
    let n = name.to_lowercase();
    if n.contains("trojan") {
        ComputerVirusType::Trojan
    } else if n.contains("ransom") {
        ComputerVirusType::Ransomware
    } else if n.contains("spy") {
        ComputerVirusType::Spyware
    } else if n.contains("rootkit") {
        ComputerVirusType::Rootkit
    } else {
        ComputerVirusType::Other
    }
}

pub fn aggregate_activity(history: &[HistoryItem]) -> Vec<ActivityStat> {
    use std::collections::BTreeMap;

    let mut map: BTreeMap<String, (u32 /* unresolved */, u32 /* resolved */)> = BTreeMap::new();

    for item in history {
        if item.category != Some(LogCategory::Scan) || item.action != Some(HistoryType::ScanFinish) {
            continue;
        }

        let Some(scan_result) = item.scan_result else {
            continue;
        };

        let month = item.timestamp.get(..7).unwrap_or("unknown").to_string();
        let entry = map.entry(month).or_insert((0, 0));
        let c = item.threat_count.unwrap_or(0);

        match scan_result {
            ScanResult::Clean | ScanResult::ThreatsFound | ScanResult::Partial => {
                entry.1 += c;
            }
            ScanResult::Failed => {
                entry.0 += c;
            }
        }
    }

    map.into_iter()
        .map(|(month, (unresolved, resolved))| ActivityStat {
            month,
            unresolved,
            resolved,
        })
        .collect()
}

pub fn aggregate_scan_types(history: &[HistoryItem]) -> Vec<ScanTypeStat> {
    let mut map: HashMap<ScanType, u32> = HashMap::new();
    let mut seen: HashSet<String> = HashSet::new();

    for item in history {
        if item.category != Some(LogCategory::Scan) || item.action != Some(HistoryType::ScanFinish) {
            continue;
        }
        let (Some(scan_type), Some(log_id)) = (item.scan_type, item.log_id.as_ref()) else {
            continue;
        };
        if !seen.insert(log_id.clone()) {
            continue;
        }
        *map.entry(scan_type).or_insert(0) += item.threat_count.unwrap_or(0);
    }

    map.into_iter()
        .map(|(scan_type, threats)| ScanTypeStat { scan_type, threats })
        .collect()
}

pub fn read_quarantine_items(app: &tauri::AppHandle) -> HashSet<String> {
    let quarantine = quarantine_dir(app);
    let mut quarantined = HashSet::new();

    if let Ok(entries) = std::fs::read_dir(&quarantine) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) == Some("json") {
                if let Ok(content) = std::fs::read_to_string(&path) {
                    if let Ok(meta) = serde_json::from_str::<QuarantinedItem>(&content) {
                        quarantined.insert(meta.id);
                    }
                }
            }
        }
    }
    quarantined
}

pub fn aggregate_threat_status(
    app: &tauri::AppHandle,
    quarantined: &HashSet<String>,
) -> Vec<ThreatStatusStat> {
    let history = load_history(app.clone(), 365).unwrap_or_default();

    let mut deleted: HashSet<String> = HashSet::new();
    let mut restored: HashSet<String> = HashSet::new();

    for item in history {
        if item.category != Some(LogCategory::Quarantine) {
            continue;
        }
        let Some(log_id) = item.log_id else { continue };
        match item.action {
            Some(HistoryType::DeleteThreat) => {
                deleted.insert(log_id.clone());
                restored.remove(&log_id);
            }
            Some(HistoryType::RestoreThreat) => {
                if !deleted.contains(&log_id) {
                    restored.insert(log_id);
                }
            }
            _ => {}
        }
    }
    let mut stats = Vec::with_capacity(3);
    if !quarantined.is_empty() {
        stats.push(ThreatStatusStat {
            status: ThreatStatus::Quarantined,
            threats: quarantined.len() as u32,
        });
    }
    if !deleted.is_empty() {
        stats.push(ThreatStatusStat {
            status: ThreatStatus::Deleted,
            threats: deleted.len() as u32,
        });
    }
    if !restored.is_empty() {
        stats.push(ThreatStatusStat {
            status: ThreatStatus::Unresolved,
            threats: restored.len() as u32,
        });
    }
    stats
}

pub fn aggregate_curr_quarantine_virus_types(app: &tauri::AppHandle) -> Vec<VirusTypeStat> {
    let mut map: HashMap<ComputerVirusType, u32> = HashMap::new();

    if let Ok(entries) = std::fs::read_dir(quarantine_dir(app)) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) != Some("json") {
                continue;
            }
            if let Ok(content) = std::fs::read_to_string(path) {
                if let Ok(meta) = serde_json::from_str::<QuarantinedItem>(&content) {
                    let vt = detect_virus_type(&meta.threat_name);
                    *map.entry(vt).or_insert(0) += 1;
                }
            }
        }
    }
    map.into_iter()
        .map(|(virus_type, threats)| VirusTypeStat {
            virus_type,
            threats,
        })
        .collect()
}
