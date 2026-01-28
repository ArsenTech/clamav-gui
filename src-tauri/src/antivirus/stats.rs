use crate::{
    antivirus::history::load_history,
    types::structs::StatsResponse,
    helpers::stats::{
        aggregate_activity,
        aggregate_curr_quarantine_virus_types,
        aggregate_scan_types,
        aggregate_threat_status,
        read_quarantine_items
    }
};
use tauri::command;
use specta::specta;

#[command]
#[specta(result)]
pub fn get_stats(app: tauri::AppHandle) -> Result<StatsResponse, String> {
    let history = load_history(app.clone(), 365)?;
    let quarantined = read_quarantine_items(&app);

    Ok(StatsResponse {
        activity: aggregate_activity(&history),
        scan_types: aggregate_scan_types(&history),
        threat_status: aggregate_threat_status(&app, &quarantined),
        virus_types: aggregate_curr_quarantine_virus_types(&app),
    })
}
