use tauri_plugin_store::StoreExt;
use crate::types::enums::settings::{SettingKeyArray,SettingKeyBool,SettingKeyString};

pub fn get_settings_as_array(app: &tauri::AppHandle, setting: SettingKeyArray) -> Result<Vec<String>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    let value = match store.get(setting.as_str()) {
        Some(v) => v,
        None => return Ok(vec![]),
    };
    match value {
        serde_json::Value::Array(arr) => {
            Ok(arr.into_iter()
                .filter_map(|v| v.as_str().map(|s| s.to_string()))
                .collect::<Vec<_>>()
                .into())
        }
        _ => {
            eprintln!("Invalid settings format, expected array");
            Ok(vec![])
        }
    }
}

pub fn get_settings_as_bool(
    app: &tauri::AppHandle,
    setting: SettingKeyBool,
) -> Result<bool, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;

    let value = match store.get(setting.as_str()) {
        Some(v) => v,
        None => return Ok(false),
    };

    match value {
        serde_json::Value::Bool(value) => Ok(value),
        _ => {
            eprintln!("Invalid settings format, expected bool");
            Ok(false)
        }
    }
}

pub fn get_settings_as_string(
    app: &tauri::AppHandle,
    setting: SettingKeyString,
) -> Result<Option<String>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;

    Ok(store
        .get(setting.as_str())
        .and_then(|v| v.as_str().map(|s| s.to_string())))
}