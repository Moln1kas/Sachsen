import { BaseDirectory, exists } from "@tauri-apps/plugin-fs";
import { handleDownload } from "./download.launcher.util";
import { ResourceEntry } from "./manifest.launcher";
import { Command } from "@tauri-apps/plugin-shell";
import { appDataDir } from "@tauri-apps/api/path";
import { platform } from "@tauri-apps/plugin-os";

const APP_DATA = await appDataDir();
const MINECRAFT_PATH = `${APP_DATA}/minecraft`;

export const isFabricExists = async (fabric_laoder_data: any) => {
  return await exists(`minecraft/libraries/net/fabricmc/fabric-loader/${fabric_laoder_data.loader.version}/fabric-loader-${fabric_laoder_data.loader.version}.jar`, {
    baseDir: BaseDirectory.AppData,
  });
}

export const downloadFabricInstaller = async (fabricFiles: ResourceEntry[]) => {
  for (const fabric of fabricFiles) {
    if (fabric.type !== 'fabric') continue;

    await handleDownload(fabric)
  }
}

export const installFabric = async (fabricFiles: ResourceEntry[], metadata: any, fabric_loader_data: any) => {
  for (const fabric of fabricFiles) {
    if (fabric.type !== 'fabric') continue

    const OS = await platform();
    const fabric_version = fabric_loader_data.loader.version;
    console.log(fabric_version)

    await Command.create(OS === 'windows' ? 'run-java-win' : 'run-java-linux', 
      [
        '-jar', fabric.destPath,
        'client',
        '-mcversion', metadata.id,
        '-dir', MINECRAFT_PATH,
        '-loader', fabric_version,
      ],
      {
        cwd: MINECRAFT_PATH,
      }
    ).spawn();
  }
}