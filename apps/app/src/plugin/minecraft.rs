// Зачатки переноса загрузчика на rust... Эх... пора щупать краба.

use fastnbt::{Value, from_bytes, to_bytes};
use std::{fs};
use tauri::State;
use crate::state::AppPaths;

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