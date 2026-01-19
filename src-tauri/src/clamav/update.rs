use specta::specta;
use std::process::Command;
use tauri::{command, Emitter};

#[command]
#[specta(result)]
pub fn update_definitions(app: tauri::AppHandle) -> Result<(), String> {
    std::thread::spawn(move || {
        let mut cmd = Command::new("freshclam");
        cmd.args(["--stdout"]);
        app.emit("freshclam:start", ()).ok();

        match cmd.output() {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout);
                let stderr = String::from_utf8_lossy(&output.stderr);

                app.emit("freshclam:output", stdout.to_string()).ok();

                if !stderr.is_empty() {
                    app.emit("freshclam:error", stderr.to_string()).ok();
                }

                app.emit("freshclam:done", ()).ok();
            }
            Err(e) => {
                app.emit("freshclam:error", e.to_string()).ok();
            }
        }
    });

    Ok(())
}

#[command]
#[specta(result)]
pub fn get_clamav_version() -> Result<String, String> {
    let output = Command::new("freshclam")
        .arg("--version")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

// TODO: use this command to return recent database update date if freshclam didn't return date: sigtool --info "*.cvd | *.cld"