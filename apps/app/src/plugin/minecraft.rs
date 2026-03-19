// Зачатки переноса загрузчика на rust... Эх... пора щупать краба.

use fastnbt::{Value, from_bytes, to_bytes};
use std::fs;
use tauri::State;
use crate::state::AppPaths;
use serde::Deserialize;
use std::path::PathBuf;
use tokio::fs as async_fs;
use tokio::sync::Semaphore;
use std::sync::Arc;
use futures_util::StreamExt;
use tokio::io::AsyncWriteExt;

#[derive(Deserialize)]
pub struct DownloadEntry {
    url: String,
    dest_path: String,
}

#[tauri::command]
pub fn add_server_to_list(
    server_name: String,
    server_address: String,
    paths: State<AppPaths>,
) -> Result<(), String> {
    let app_data_dir = &paths.app_data_dir;

    let servers_path = app_data_dir.join("minecraft/servers.dat");

    println!("Dir: {:?}", servers_path);

    if !servers_path.exists() {
        println!("not exists, creating...");
        let empty_data = Value::Compound(
            [(
                "servers".to_string(),
                Value::List(vec![]),
            )]
            .into_iter()
            .collect(),
        );
        let bytes = to_bytes(&empty_data).map_err(|e| e.to_string())?;
        fs::write(&servers_path, bytes).map_err(|e| format!("{e}"))?;
    }

    let data = fs::read(&servers_path)
        .map_err(|_| "servers.dat read error".to_string())?;

    let mut root: Value =
        from_bytes(&data).map_err(|e| format!("{e}"))?;


    if let Value::Compound(ref mut compound) = root {
        if let Some(Value::List(ref mut list)) = compound.get_mut("servers") {
            let new_server = Value::Compound(
                [
                    ("name".to_string(), Value::String(server_name.clone())),
                    ("ip".to_string(), Value::String(server_address.clone())),
                ]
                .into_iter()
                .collect(),
            );

            let already_exists = list.iter().any(|s| {
                if let Value::Compound(map) = s {
                    if let Some(Value::String(ip)) = map.get("ip") {
                        return ip == &server_address;
                    }
                }
                false
            });

            if already_exists {
                return Err(format!("Сервер '{}' уже есть в списке", server_address));
            }

            list.push(new_server);
        }
    }

    let new_bytes = to_bytes(&root).map_err(|e| e.to_string())?;
    fs::write(&servers_path, new_bytes)
        .map_err(|_| "Не удалось записать servers.dat".to_string())?;

    println!("added '{server_name}' ({server_address})");

    Ok(())
}

#[tauri::command]
pub async fn download_file(url: String, dest_path: String) -> Result<(), String> {
    let path = PathBuf::from(&dest_path);

    if let Some(parent) = path.parent() {
        async_fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }

    let client = reqwest::Client::builder()
        .user_agent("Minecraft-Launcher")
        .connect_timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())?;

    let response = client.get(url).send().await.map_err(|e| e.to_string())?;
    
    if !response.status().is_success() {
        return Err(format!("{}", response.status()));
    }

    let mut file = async_fs::File::create(&path).await.map_err(|e| e.to_string())?;
    let mut stream = response.bytes_stream();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
    }

    file.flush().await.map_err(|e| e.to_string())?;

    println!("Файл успешно загружен: {:?}", path);
    Ok(())
}

#[tauri::command]
pub async fn download_assets_parallel(entries: Vec<DownloadEntry>, concurrency: usize) -> Result<(), String> {
    let client = reqwest::Client::builder()
        .user_agent("Minecraft-Launcher")
        .tcp_keepalive(std::time::Duration::from_secs(60))
        .pool_max_idle_per_host(concurrency)
        .build()
        .map_err(|e| e.to_string())?;
    
    let client = Arc::new(client);
    let semaphore = Arc::new(Semaphore::new(concurrency));
    let mut tasks = Vec::new();

    for entry in entries {
        let client = Arc::clone(&client);
        let semaphore = Arc::clone(&semaphore);
        
        tasks.push(tokio::spawn(async move {
            let _permit = semaphore.acquire().await.map_err(|e| e.to_string())?;
            let path = PathBuf::from(&entry.dest_path);
            
            if path.exists() {
                return Ok(());
            }

            if let Some(parent) = path.parent() {
                async_fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
            }

            let response = client.get(&entry.url).send().await.map_err(|e| e.to_string())?;
            let bytes = response.bytes().await.map_err(|e| e.to_string())?;
            
            async_fs::write(path, bytes).await.map_err(|e| e.to_string())?;
            
            Ok::<(), String>(())
        }));
    }

    for task in tasks {
        task.await.map_err(|e| e.to_string())??;
    }

    Ok(())
}