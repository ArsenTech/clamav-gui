use std::{
    io,
    path::{Path, PathBuf},
};
use tauri::Manager;

pub fn quarantine_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

pub fn quarantine_dir(app: &tauri::AppHandle) -> PathBuf {
    let mut dir = app.path().app_data_dir().unwrap();
    dir.push("quarantine");
    if let Err(e) = std::fs::create_dir_all(&dir) {
        eprintln!("[ERROR]: {}", e.to_string())
    }
    dir
}

pub fn move_file_cross_device(src: &Path, dest: &Path) -> io::Result<()> {
    match std::fs::rename(src, dest) {
        Ok(_) => Ok(()),
        Err(e) if e.kind() == io::ErrorKind::CrossesDevices => {
            std::fs::copy(src, dest)?;
            std::fs::remove_file(src)?;
            Ok(())
        }
        Err(e) => Err(e),
    }
}
