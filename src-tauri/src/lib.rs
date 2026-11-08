pub mod security {
    pub mod path_auth;
}
pub mod commands {
    pub mod fs;
    pub mod watcher;
}
pub mod db {
    pub mod sqlite;
}

use std::sync::Arc;
use tauri::{Emitter, Manager, State};
use security::path_auth::SecurityContext;
use db::sqlite::Database;

#[tauri::command]
fn ping() -> String {
    "pong".into()
}

#[tauri::command]
fn save_session_state(db: State<'_, Arc<Database>>, key: String, value: String) -> Result<(), String> {
    db.save(&key, &value)
}

#[tauri::command]
fn load_session_state(db: State<'_, Arc<Database>>, key: String) -> Result<Option<String>, String> {
    db.load(&key)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let security_context = SecurityContext::new();
    let db = Arc::new(Database::new(None).expect("Failed to initialize SQLite database"));

    tauri::Builder::default()
        .manage(security_context)
        .manage(db)
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            println!("Single instance triggered with args: {:?}", argv);
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.emit("single-instance-open-file", argv);
            }
        }))
        .invoke_handler(tauri::generate_handler![
            ping,
            commands::fs::read_text_file,
            commands::fs::write_text_file_atomic,
            commands::fs::authorize_standalone_file,
            commands::watcher::open_workspace,
            save_session_state,
            load_session_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
