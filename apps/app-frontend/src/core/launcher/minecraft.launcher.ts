import { appDataDir, BaseDirectory, dirname, join } from "@tauri-apps/api/path";
import { DirEntry, exists, readDir, remove } from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import { useUserStore } from "../../stores/user.store";
import { ResourceEntry } from "./manifest.launcher";
import { ensureDir, handleDownload } from "./download.launcher.util";
import { platform } from "@tauri-apps/plugin-os";

const APP_DATA = await appDataDir();
const MINECRAFT_PATH = `${APP_DATA}/minecraft`;
const LIBRARIES_PATH = `${MINECRAFT_PATH}/libraries`;
const VERSIONS_PATH = `${MINECRAFT_PATH}/versions`;
const ASSETS_PATH = `${MINECRAFT_PATH}/assets`;

const CLIENT_JAR_PATH = `${VERSIONS_PATH}/client.jar`;

export const initBaseDirs = async () => {
  await ensureDir(MINECRAFT_PATH);
  await ensureDir(LIBRARIES_PATH);
  await ensureDir(VERSIONS_PATH);
  await ensureDir(ASSETS_PATH);
}

export const downloadMinecraftClient = async (clients: ResourceEntry[]) => {
  for (const client of clients) {
    if (client.type !== 'client') continue;

    await handleDownload(client)
  }
}

export const downloadMinecraftLibraries = async (libraries: ResourceEntry[] /*metadata: any*/ ) => {
  for (const library of libraries) {
    if (library.type !== 'library') continue;

    await ensureDir(await dirname(library.destPath), true);
    await handleDownload(library);
  }
}

export const downloadMinecraftAssets = async (assets: ResourceEntry[] /*metadata: any*/) => {
  for (const asset of assets) {
    if (asset.type !== 'asset') continue;

    await ensureDir(await dirname(asset.destPath), true);
    await handleDownload(asset);
  }
}

export const downloadMinecraftIndexes = async (indexes: ResourceEntry[]) => {
  for (const index of indexes) {
    if (index.type !== 'index') continue;

    await ensureDir(await dirname(index.destPath), true);
    await handleDownload(index);
  }
}

export const isMinecraftExists = async () => {
  return await exists('minecraft/versions/client.jar', {
    baseDir: BaseDirectory.AppData,
  });
} // В будущем улучшить проверку!

export const deleteMinecraft = async () => {
  if(await isMinecraftExists()) {
    await remove(`minecraft/`, { 
      recursive: true,
      baseDir: BaseDirectory.AppData
    });
  }
}

export const launchMinecraft = async (metadata: any, fabric_loader_data: any) => {
  let classpath: string[] = [];
  classpath.push(CLIENT_JAR_PATH);

  async function processEntriesRecursively(parent: string, entries: DirEntry[]) {
    for (const entry of entries) {
      const dir = await join(parent, entry.name);
      if (entry.isDirectory) {
        await processEntriesRecursively(dir, await readDir(dir));
      } else if (entry.isFile && entry.name.endsWith('.jar')) {
        classpath.push(dir.replace(/\\/g, '/'));
      }
    }
  }

  const entries = await readDir(LIBRARIES_PATH);
  const OS = await platform();
  await processEntriesRecursively(LIBRARIES_PATH, entries);

  const classpathString = classpath.join(OS === 'windows' ? ';' : ':');

  const userStore = useUserStore();

  await Command.create(OS === 'windows' ? 'run-java-win' : 'run-java-linux',  
    [
      '-Xmx4G',
      '-Xms1G',
      '-cp', classpathString,
      fabric_loader_data.launcherMeta.mainClass.client,
      '--accessToken', '',
      '--version', metadata.id,
      '--username', userStore.user.username,
      '--gameDir', `${MINECRAFT_PATH}`,
      '--assetsDir', `${MINECRAFT_PATH}/assets`,
      '--assetIndex', metadata.assetIndex.id,
      // '--quickPlayMultiplayer', 'mc.molnikas.su',
    ],
    {
      cwd: MINECRAFT_PATH,
    }
  ).spawn();
}