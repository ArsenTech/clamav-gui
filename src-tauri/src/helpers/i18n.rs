use std::collections::HashMap;
use serde_json::Value;
use once_cell::sync::Lazy;
use std::sync::RwLock;
use tauri::Manager;

pub static TRANSLATIONS: Lazy<RwLock<HashMap<String, String>>> =
    Lazy::new(|| RwLock::new(HashMap::new()));

pub fn flatten_json(
    value: &Value,
    prefix: String,
    map: &mut HashMap<String, String>,
) {
     match value {
          Value::Object(obj) => {
               for (key, val) in obj {
                    let new_prefix = if prefix.is_empty() {
                         key.clone()
                    } else {
                         format!("{}.{}", prefix, key)
                    };
                    flatten_json(val, new_prefix, map);
               }
          }
          Value::String(s) => {
               map.insert(prefix, s.clone());
          }
          _ => {}
     }
}

pub fn load_translations(app: &tauri::AppHandle, lang: &str) -> HashMap<String, String> {
     let path = app
          .path()
          .resolve(format!("i18n/{}.json", lang), tauri::path::BaseDirectory::Resource)
          .or_else(|_| {
               app.path()
                    .resolve("i18n/en.json", tauri::path::BaseDirectory::Resource)
          })
          .expect("Failed to resolve translation file");

     let content = std::fs::read_to_string(path)
          .unwrap_or_else(|_| "{}".to_string());

     let json: serde_json::Value =
          serde_json::from_str(&content).unwrap_or(serde_json::Value::Null);

     let mut map = HashMap::new();
     flatten_json(&json, "".into(), &mut map);

     map
}

pub fn t(
    key: &str,
) -> String {
     let guard = TRANSLATIONS.read().unwrap();
     guard
          .get(key)
          .cloned()
          .unwrap_or_else(|| key.to_string())
}