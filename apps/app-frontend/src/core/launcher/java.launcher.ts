import { download } from "@tauri-apps/plugin-upload";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";
import { remove } from "@tauri-apps/plugin-fs";

export const downloadJava = async () => {
  const appData = await appDataDir();
  await download(
  'http://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse',
  `${appData}/java.tar.gz`,
  ({ progress, total }) =>
    console.log(`Downloaded ${progress} of ${total} bytes`),
  );
  await invoke('extract_archive', {
    archivePath: `${appData}/java.tar.gz`,
    outputPath: `${appData}/java`
  });
  await remove('java.tar.gz', { baseDir: BaseDirectory.AppData })
}