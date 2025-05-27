mod api;
mod db;
mod models;

use db::core::Database;
use tauri::State;

struct AppState {
    db: Database,
}

#[tauri::command]
async fn login(email: String, password: String, state: State<'_, AppState>) -> Result<(), String> {
    api::auth::sign_in(&state.db, &email, &password)
        .await
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let db = Database::new()
        .await
        .expect("Failed to initialize the database");

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
