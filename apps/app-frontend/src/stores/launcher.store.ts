import { defineStore } from 'pinia';
import { 
  deleteJava, 
  downloadJava, 
  extractJava, 
  isJavaExists 
} from '../core/launcher/java.launcher';
import { 
  deleteMinecraft,
  downloadMinecraftAssets, 
  downloadMinecraftClient, 
  downloadMinecraftIndexes, 
  downloadMinecraftLibraries, 
  initBaseDirs, 
  isMinecraftExists, 
  launchMinecraft 
} from '../core/launcher/minecraft.launcher';
import { getFabricLoaderData, getFabricMetadata, getMinecraftMetadata, getMinecraftMods } from '../api/minecraft.api';
import { customConfirm } from '../core/dialog/confirm.dialog';
import { buildManifestFromMetadata, ResourceEntry } from '../core/launcher/manifest.launcher';
import { appDataDir } from '@tauri-apps/api/path';
import { downloadFabricInstaller, installFabric, isFabricExists } from '../core/launcher/fabric.launcher';
import { syncMods, isModsExists } from '../core/launcher/mods.launcher';

export const useLauncherStore = defineStore('launcher', {
  state: () => ({
    status: '#' as string,
    buttonText: 'Запустить' as string,
    isButtonDisabled: false as boolean,
    manifest: [] as ResourceEntry[],
  }),
  getters: {
    clientFiles: (state) => state.manifest.filter(r => r.type === 'client'),
    libraryFiles: (state) => state.manifest.filter(r => r.type === 'library'),
    assetFiles: (state) => state.manifest.filter(r => r.type === 'asset'),
    indexFiles: (state) => state.manifest.filter(r => r.type === 'index'),
    javaFiles: (state) => state.manifest.filter(r => r.type === 'java'),
    fabricFiles: (state) => state.manifest.filter(r => r.type === 'fabric'),
    modFiles: (state) => state.manifest.filter(r => r.type === 'mod'),
  },
  actions: {
    setStatus(text: string) {
      this.status = text;
    },

    setButtonText(text: string) {
      this.buttonText = text;
    },

    disableButton(disabled: boolean) {
      this.isButtonDisabled = disabled;
    },

    async isInstalled(): Promise<boolean> {
      const METADATA = await getMinecraftMetadata();
      const fabric_loader_data = await getFabricLoaderData(METADATA.id);

      if (!(await isJavaExists())) return false;
      if (!(await isMinecraftExists())) return false;
      if (!(await isFabricExists(fabric_loader_data))) return false;
      if (!(await isModsExists(this.modFiles))) return false;

      return true;
    },

    async initManifest() {
      const APP_DATA = await appDataDir();
      const METADATA = await getMinecraftMetadata();
      const FABRIC_METADATA = await getFabricMetadata();
      const MOD_LIST = await getMinecraftMods()

      this.manifest = await buildManifestFromMetadata(METADATA, FABRIC_METADATA, MOD_LIST, APP_DATA);
    },

    async launch() {
      this.disableButton(true);

      const METADATA = await getMinecraftMetadata();
      const fabric_loader_data = await getFabricLoaderData(METADATA.id);
      
      const java = await isJavaExists();
      const game = await isMinecraftExists();
      const fabric = await isFabricExists(fabric_loader_data);
      const mods = await isModsExists(this.modFiles);

      if (!java || !game || !fabric || !mods) {
        const pending = await this.buildPendingManifest();
        const manifestInfo = await this.buildManifestInfo(pending);
        const confirm = await customConfirm(
          `БЕРЕГИСЬ!!!`,
          `Убедитесь, что вы доверяете источникам:\n\n${manifestInfo}\n\nПродолжайте только на свой страх и риск!`,
          750,
          550
        );
        if (!confirm) return this.disableButton(false);
      }
      
      if (!java) {
        this.setStatus('Загрузка Java...');
        await downloadJava(this.javaFiles);
        this.setStatus('Распаковка Java...');
        await extractJava(this.javaFiles);
        this.setStatus('Java успешно загружена.');
      } else this.setStatus('Java уже установлена.');

      if (!game) {
        this.setStatus('Инициализация Minecraft директорий...');
        await initBaseDirs();
        this.setStatus('Minecraft директории инициализированы.');

        this.setStatus('Загрузка Minecraft клиента...');
        await downloadMinecraftClient(this.clientFiles);
        this.setStatus('Minecraft клиент успешно загружен.');

        this.setStatus('Загрузка Minecraft библиотек...');
        await downloadMinecraftLibraries(this.libraryFiles);
        this.setStatus('Minecraft библиотеки успешно загружены.');
        
        this.setStatus('Загрузка Minecraft ассетов...');
        await downloadMinecraftAssets(this.assetFiles);
        await downloadMinecraftIndexes(this.indexFiles);
        this.setStatus('Minecraft ассеты успешно загружены.');

      } else this.setStatus('Minecraft уже установлен')

      if (!fabric) {
        this.setStatus('Загрузка установщика Fabric...');
        await downloadFabricInstaller(this.fabricFiles);
        this.setStatus('Установщик Fabric загружен.');

        this.setStatus('Установка Fabric...');
        await installFabric(this.fabricFiles, METADATA);
        this.setStatus('Fabric успешно установлен.');
      }

      this.setStatus('Синхронизация модов...');
      await syncMods(this.modFiles);
      this.setStatus('Моды успешно синхронизированы.');

      await launchMinecraft(METADATA, fabric_loader_data);
      this.setStatus('Клиент запущен.');

      await this.setButtonText('Запустить');
      this.disableButton(false);
    },

    async delete() {
      this.disableButton(true);

      this.setStatus('Удаление Java...');
      await deleteJava();
      this.setStatus('Java успешно удалена.');

      this.setStatus('Удаление Minecraft...');
      await deleteMinecraft();
      this.setStatus('Minecraft успешно удален.');

      await this.setButtonText('Установить');

      this.disableButton(false);
    },

    async buildPendingManifest(): Promise<ResourceEntry[]> {
      const METADATA = await getMinecraftMetadata();
      const fabric_loader_data = await getFabricLoaderData(METADATA.id);
      const pending: ResourceEntry[] = [];

      const java = await isJavaExists();
      const game = await isMinecraftExists();
      const fabric = await isFabricExists(fabric_loader_data);
      const mods = await isModsExists(this.modFiles);

      if (!java) {
        pending.push(...this.javaFiles);
      }

      if (!game) {
        pending.push(...this.clientFiles);
        pending.push(...this.libraryFiles);
        pending.push(...this.assetFiles);
        pending.push(...this.indexFiles);
      }

      if (!fabric) {
        pending.push(...this.fabricFiles);
      }

      if (!mods) {
        pending.push(...this.modFiles);
      }


      return pending;
    },

    async buildManifestInfo(entries?: ResourceEntry[]): Promise<string> {
      const list = entries ?? this.manifest;
      if (!list.length) return 'Манифест пуст.';

      const grouped: Record<string, ResourceEntry[]> = {};
      for (const entry of list) {
        try {
          const url = new URL(entry.url);
          const domain = url.origin;
          if (!grouped[domain]) grouped[domain] = [];
          grouped[domain].push(entry);
        } catch {
          if (!grouped['unknown']) grouped['unknown'] = [];
          grouped['unknown'].push(entry);
        }
      }

      const APP_DATA = await appDataDir();
      const relativePath = (fullPath: string, appData: string) => {
        return fullPath.replace(appData, "").replace(/^[/\\]+/, "");
      }

      return Object.entries(grouped)
        .map(([domain, entries]) => {
          if (entries.length > 10) {
            return `${domain}\n  - ${relativePath(entries[0].destPath, APP_DATA)}\n  - ${relativePath(entries[1].destPath, APP_DATA)}\n  ... и ещё ${entries.length - 2} файлов`;
          }
          return `${domain}\n${entries.map(e => `  - ${relativePath(e.destPath, APP_DATA)}`).join('\n')}`;
        })
        .join('\n\n');
    }
  },
});