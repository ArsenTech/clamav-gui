pub mod quarantine;
pub mod scan;
pub mod update;
pub mod bulk_actions;

use specta::specta;
use tauri::command;

#[command]
#[specta(result)]
pub fn remove_file(
     file_path: String
) -> Result<(),String>{
     std::fs::remove_file(file_path).ok();
     Ok(())
}