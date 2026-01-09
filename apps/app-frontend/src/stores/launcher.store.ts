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
import { getFabricLoaderData, getFabricMetadata, getMinecraftMods } from '../api/minecraft.api';
import { confirmDialog } from '../core/dialog/dialog';
import { buildManifestFromMetadata, ResourceEntry } from '../core/launcher/manifest.launcher';
import { appDataDir } from '@tauri-apps/api/path';
import { downloadFabricInstaller, installFabric, isFabricExists } from '../core/launcher/fabric.launcher';
import { syncMods, isModsExists } from '../core/launcher/mods.launcher';
import { useServerStore } from './server.store';
import { invoke } from '@tauri-apps/api/core';

export const useLauncherStore = defineStore('launcher', {
  state: () => ({
    status: '#' as string,
    buttonText: 'Запустить' as string,
    isPlayButtonDisabled: false as boolean,
    isDeleteButtonDisabled: false as boolean,
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
    // setButtonText(text: string) {
    //   this.status = text;
    // },

    setButtonText(text: string) {
      this.buttonText = text;
    },

    disablePlayButton(disabled: boolean) {
      this.isPlayButtonDisabled = disabled;
    },

    disableDeleteButton(disabled: boolean) {
      this.isDeleteButtonDisabled = disabled;
    },

    requireMetadata() {
      const serverStore = useServerStore();
      const METADATA = serverStore.metadata;

      if (!METADATA) {
        this.setButtonText("Не удалось найти игровой сервер");
        this.disablePlayButton(true);
        this.disableDeleteButton(false);
        return null;
      }

      return METADATA;
    },

    async isInstalled(): Promise<boolean> {
      const METADATA = this.requireMetadata();
      if (!METADATA) return false;
      const fabric_loader_data = await getFabricLoaderData(METADATA.id);

      if (!(await isJavaExists())) return false;
      if (!(await isMinecraftExists())) return false;
      if (!(await isFabricExists(fabric_loader_data))) return false;
      if (!(await isModsExists(this.modFiles))) return false;

      return true;
    },

    async initManifest() {
      const METADATA = this.requireMetadata();
      if (!METADATA) return;

      const serverStore = useServerStore();

      const APP_DATA = await appDataDir();
      const FABRIC_METADATA = await getFabricMetadata();
      const MOD_LIST = await getMinecraftMods(serverStore.serverId)

      this.manifest = await buildManifestFromMetadata(METADATA, FABRIC_METADATA, MOD_LIST, APP_DATA);
    },

    async launch() {
      this.disablePlayButton(true);
      this.disableDeleteButton(true);

      await this.initManifest();

      const serverStore = useServerStore();

      const METADATA = this.requireMetadata();
      if (!METADATA) return;

      const fabric_loader_data = await getFabricLoaderData(METADATA.id);
      
      const java = await isJavaExists();
      const game = await isMinecraftExists();
      const fabric = await isFabricExists(fabric_loader_data);
      const mods = await isModsExists(this.modFiles);

      if (!java || !game || !fabric || !mods) {
        const pending = await this.buildPendingManifest();
        const manifestInfo = await this.buildManifestInfo(pending);
        const confirm = await confirmDialog(
          `БЕРЕГИСЬ!!!`,
          `Убедитесь, что вы доверяете источникам:\n\n${manifestInfo}\n\nПродолжайте только на свой страх и риск!`,
          { width: 750, height: 550 },
        );
        if (!confirm) return this.disablePlayButton(false);
      }
      
      if (!java) {
        this.setButtonText('Загрузка Java...');
        await downloadJava(this.javaFiles);
        this.setButtonText('Распаковка Java...');
        await extractJava(this.javaFiles);
        this.setButtonText('Java успешно загружена.');
      } else this.setButtonText('Java уже установлена.');

      if (!game) {
        this.setButtonText('Инициализация Minecraft директорий...');
        await initBaseDirs();
        this.setButtonText('Minecraft директории инициализированы.');

        this.setButtonText('Загрузка Minecraft клиента...');
        await downloadMinecraftClient(this.clientFiles);
        this.setButtonText('Minecraft клиент успешно загружен.');

        this.setButtonText('Загрузка Minecraft библиотек...');
        await downloadMinecraftLibraries(this.libraryFiles);
        this.setButtonText('Minecraft библиотеки успешно загружены.');
        
        this.setButtonText('Загрузка Minecraft ассетов...');
        await downloadMinecraftAssets(this.assetFiles);
        await downloadMinecraftIndexes(this.indexFiles);
        this.setButtonText('Minecraft ассеты успешно загружены.');
      } else this.setButtonText('Minecraft уже установлен')

      if (!fabric) {
        this.setButtonText('Загрузка установщика Fabric...');
        await downloadFabricInstaller(this.fabricFiles);
        this.setButtonText('Установщик Fabric загружен.');

        this.setButtonText('Установка Fabric...');
        await installFabric(this.fabricFiles, METADATA, fabric_loader_data);
        this.setButtonText('Fabric успешно установлен.');
      }

      try {
        if (!serverStore.server) throw new Error('Нет данных о сервере');

        await invoke('add_server_to_list', { 
          serverName: serverStore.server.name,
          serverAddress: serverStore.server.serverAddress
        });
      } catch(err: any) {
        console.warn(err);
      }

      this.setButtonText('Синхронизация модов...');
      await syncMods(this.modFiles);
      this.setButtonText('Моды успешно синхронизированы.');

      await launchMinecraft(METADATA, fabric_loader_data);
      this.setButtonText('Клиент запущен.');

      await this.setButtonText('Запустить');

      this.manifest = [];

      this.disablePlayButton(false);
      this.disableDeleteButton(false);
    },

    async delete() {
      this.disablePlayButton(true);
      this.disableDeleteButton(true);

      await this.initManifest();

      const metadata = this.requireMetadata()
      const confirm = await confirmDialog(
        `А вы уверены?`,
        `Вы точно хотите удалить игру?\n\nБудут удалены все файлы java и minecraft.`,
        { width: 450, height: 250 },
      );
      if (!confirm) {
        if(metadata) {
          this.disablePlayButton(false);
        }
        
        this.disableDeleteButton(false);
        return;
      }

      this.setButtonText('Удаление Java...');
      await deleteJava();
      this.setButtonText('Java успешно удалена.');

      this.setButtonText('Удаление Minecraft...');
      await deleteMinecraft();
      this.setButtonText('Minecraft успешно удален.');

      await this.setButtonText('Установить');

      this.manifest = [];

      if(metadata) {
        this.disablePlayButton(false);
      }
      this.disableDeleteButton(false);
    },

    async buildPendingManifest(): Promise<ResourceEntry[]> {
      const serverStore = useServerStore();

      const METADATA = serverStore.metadata;
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