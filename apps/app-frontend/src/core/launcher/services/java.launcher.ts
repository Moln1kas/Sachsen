import { BaseDirectory, dirname } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { remove, exists } from "@tauri-apps/plugin-fs";
import { ResourceEntry } from "./manifest.launcher";
import { platform } from "@tauri-apps/plugin-os";

export const isJavaExists = async () => {
  return await exists(`java/bin/java${platform() === "windows" ? ".exe" : ""}`, {
    baseDir: BaseDirectory.AppData,
  });
}

export const downloadJava = async (javaFiles: ResourceEntry[]) => {
  const javaFile = javaFiles.find(f => f.type === 'java');
  if (!javaFile) return;

  try {
    await invoke('download_file', {
      url: javaFile.url,
      destPath: javaFile.destPath
    });
  } catch (error) {
    throw new Error(`Критическая ошибка при загрузке Java: ${error}`);
  }
}

export const extractJava = async (javaFiles: ResourceEntry[]) => {
  for (const java of javaFiles) {
    if (java.type !== 'java') continue;

    await invoke('extract_archive', {
      archivePath: `${java.destPath}`,
      outputPath: `${await dirname(java.destPath)}`,
    });
  }
}

export const deleteJava = async () => {
  if(await isJavaExists()) {
    await remove(`java`, { 
      recursive: true,
      baseDir: BaseDirectory.AppData
    });
  }
}
