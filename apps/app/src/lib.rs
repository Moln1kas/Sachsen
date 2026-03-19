mod plugin;
mod state;

use plugin::archive::extract_archive;
use plugin::minecraft::{add_server_to_list, download_assets_parallel, download_file};
use tauri::{Manager};
use state::AppPaths;
use tauri_plugin_log::{Target, TargetKind, Builder as LogBuilder};
use log::LevelFilter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_data = app
                .path()
                .app_data_dir()
                .expect("app_data_dir error");

            app.manage(AppPaths {
                app_data_dir: app_data,
            });

            Ok(())
        })
        .plugin(
            LogBuilder::new()
                .level(LevelFilter::Info)
                .filter(|metadata| {
                    let target = metadata.target();
                    !target.starts_with("hyper") && 
                    !target.starts_with("reqwest") && 
                    !target.starts_with("rustls")
                })
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                ])
                .build()
        )
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            extract_archive, 
            add_server_to_list,
            download_assets_parallel,
            download_file,
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
