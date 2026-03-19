import { exists, mkdir, readDir, remove, writeFile } from "@tauri-apps/plugin-fs";
import { ResourceEntry } from "./manifest.launcher";
import { ensureDir, handleDownload } from "../utils/downloader.util";
import { appDataDir, dirname, join } from "@tauri-apps/api/path";
import { runParallel } from "../utils/parallel-worker.util";

export const isModsExists = async (modFiles: ResourceEntry[]) => {
  for (const mod of modFiles) {
    if (mod.type !== 'mod') continue;

    const isExists = await exists(`${mod.destPath}`);

    if(!isExists) return false
  }

  return true;
}

export const syncMods = async (modFiles: ResourceEntry[]) => {
  const appdata = await appDataDir();

  console.log(modFiles)

  if(!(await exists(`${appdata}/minecraft/mods`))) {
    await mkdir(`${appdata}/minecraft/mods`);
  }

  const existingMods = await readDir(`${appdata}/minecraft/mods`);

  const expectedNames = modFiles
    .filter(m => m.type === "mod")
    .map(m => m.destPath.split(/[\\/]/).pop());

  for (const mod of existingMods) {
    if (!expectedNames.includes(mod.name)) {
      await remove(await join(await appDataDir(), 'minecraft/mods', mod.name));
    }
  }

  await runParallel(
    modFiles.filter(e => e.type === 'mod'),
    async (mod) => {
      await ensureDir(await dirname(mod.destPath), true);
      await handleDownload(mod);
    },
    4,
  );
}

export const configureSkinLoader = async () => {
  const appdata = await appDataDir();
  const customSkinLoaderPath = `${appdata}/minecraft/CustomSkinLoader`;

  console.log('configuring skin loader...')

  if(!(await exists(customSkinLoaderPath))) {
    console.warn('CustomSkinLoader not found.');
    return;
  }

  const api = import.meta.env.VITE_API_URL;

  const configContent: string = JSON.stringify({
    "version": "14.27",
    "buildNumber": 37,
    "loadlist": [
      {
        "name": "GameProfile",
        "type": "GameProfile"
      },
      {
        "name": "SachsenSkins",
        "type": "CustomSkinAPI",
        "root": `${api}/skins/`
      }
    ],
    "enableDynamicSkull": true,
    "enableTransparentSkin": true,
    "forceLoadAllTextures": true,
    "enableCape": true,
    "threadPoolSize": 8,
    "enableLogStdOut": false,
    "cacheExpiry": 30,
    "forceUpdateSkull": false,
    "enableLocalProfileCache": false,
    "enableCacheAutoClean": false,
    "forceDisableCache": false
  }, null, 2);

  const encoder = new TextEncoder();
  const data = encoder.encode(configContent);

  await writeFile(`${customSkinLoaderPath}/CustomSkinLoader.json`, data);

  console.log('skin loader successfuly configured.')
}