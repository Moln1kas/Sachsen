use std::fs;
use std::path::{Path};
use std::fs::File;
use std::io::BufReader;

use flate2::read::GzDecoder;
use tar::Archive;
use zip::ZipArchive;

#[tauri::command]
pub fn extract_archive(archive_path: String, output_path: String) -> Result<(), String> {
    // Временная директория для распаковки
    let temp_dir = Path::new(&output_path).with_extension("temp");

    // Удалим, если уже есть
    let _ = fs::remove_dir_all(&temp_dir);

    // Распаковываем
    if archive_path.ends_with(".tar.gz") || archive_path.ends_with(".tgz") {
        extract_tar_gz(&archive_path, &temp_dir)?;
    } else if archive_path.ends_with(".zip") {
        extract_zip(&archive_path, &temp_dir)?;
    } else {
        return Err("Unsupported archive format".into());
    }

    // Ожидаем одну папку внутри temp_dir
    let mut entries = fs::read_dir(&temp_dir)
        .map_err(|e| format!("Failed to read temp dir: {e}"))?
        .filter_map(Result::ok)
        .filter(|e| e.file_type().map(|f| f.is_dir()).unwrap_or(false));

    let first_folder = entries.next()
        .ok_or("Archive did not contain any folders")?
        .path();

    if entries.next().is_some() {
        return Err("Archive contains more than one root folder".into());
    }

    // Удалим старую папку, если есть
    let _ = fs::remove_dir_all(&output_path);

    // Переименуем
    fs::rename(first_folder, &output_path)
        .map_err(|e| format!("Failed to rename folder: {e}"))?;

    // Удалим temp_dir, если пустой
    let _ = fs::remove_dir_all(&temp_dir);

    Ok(())
}

fn extract_tar_gz(archive_path: &str, dest: &Path) -> Result<(), String> {
    let tar_gz = File::open(archive_path).map_err(|e| e.to_string())?;
    let buf_reader = BufReader::new(tar_gz);
    let decoder = GzDecoder::new(buf_reader);
    let mut archive = Archive::new(decoder);
    archive.unpack(dest).map_err(|e| e.to_string())
}

fn extract_zip(archive_path: &str, dest: &Path) -> Result<(), String> {
    let file = File::open(archive_path).map_err(|e| e.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut zip_file = archive.by_index(i).map_err(|e| e.to_string())?;
        let out_path = dest.join(zip_file.sanitized_name());

        if zip_file.name().ends_with('/') {
            fs::create_dir_all(&out_path).map_err(|e| e.to_string())?;
        } else {
            if let Some(p) = out_path.parent() {
                fs::create_dir_all(p).map_err(|e| e.to_string())?;
            }
            let mut outfile = File::create(&out_path).map_err(|e| e.to_string())?;
            std::io::copy(&mut zip_file, &mut outfile).map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

