import { exists, mkdir, readDir, remove } from "@tauri-apps/plugin-fs";
import { ResourceEntry } from "./manifest.launcher";
import { ensureDir, handleDownload } from "./download.launcher.util";
import { appDataDir, dirname, join } from "@tauri-apps/api/path";

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

  for (const mod of modFiles) {
    if (mod.type !== 'mod') continue;

    await ensureDir(await dirname(mod.destPath), true);
    await handleDownload(mod);
  }
}