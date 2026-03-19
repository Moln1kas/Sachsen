import { defineStore } from "pinia";
import { buildManifestFromMetadata, ResourceEntry } from "../core/launcher/services/manifest.launcher";
import { useServerStore } from "./server.store";
import { appDataDir } from "@tauri-apps/api/path";
import { getFabricLoaderData, getFabricMetadata, getMinecraftMods } from "../api/minecraft.api";
import { deleteJava, downloadJava, extractJava, isJavaExists } from "../core/launcher/services/java.launcher";
import { deleteMinecraft, downloadMinecraftClient, downloadMinecraftIndexes, downloadMinecraftLibraries, initBaseDirs, isMinecraftExists, launchMinecraft } from "../core/launcher/services/minecraft.launcher";
import { downloadFabricInstaller, installFabric, isFabricExists } from "../core/launcher/services/fabric.launcher";
import { configureSkinLoader, isModsExists, syncMods } from "../core/launcher/services/mods.launcher";
import { confirmDialog } from "../core/dialog/dialog";
import { invoke } from "@tauri-apps/api/core";
import { useUserStore } from "./user.store";

export const useLauncherStore = defineStore("launcher", {
  state: () => ({
    isBusy: false as boolean,
    currentStepText: 'Запустить' as string,
    manifest: [] as ResourceEntry[],
    error: null as string | null,
  }),

  getters: {
    clientFiles: (state) => state.manifest.filter(r => r.type === 'client'),
    libraryFiles: (state) => state.manifest.filter(r => r.type === 'library'),
    assetFiles: (state) => state.manifest.filter(r => r.type === 'asset'),
    indexFiles: (state) => state.manifest.filter(r => r.type === 'index'),
    javaFiles: (state) => state.manifest.filter(r => r.type === 'java'),
    fabricFiles: (state) => state.manifest.filter(r => r.type === 'fabric'),
    modFiles: (state) => state.manifest.filter(r => r.type === 'mod'),
    playButtonState: (state) => {
      const userStore = useUserStore();
      const status = userStore.user.status;

      if (status === 'PENDING') return { text: 'Аккаунт не подтвержден', disabled: true };
      if (status === 'REJECTED') return { text: 'Заявка отклонена', disabled: true };
      if (status === 'BANNED') return { text: 'Аккаунт заблокирован', disabled: true };

      if (state.isBusy) return { text: state.currentStepText, disabled: true };

      return { text: state.currentStepText, disabled: false };
    }
  },

  actions: {
    async runLauncherWorkflow() {
      if (this.isBusy) return;

      this.isBusy = true;
      this.error = null;

      try {
        const serverStore = useServerStore();
        const metadata = serverStore.metadata;
        if (!metadata) throw new Error('Сервер не выбран');

        await this.initManifest();
        const fabricLoaderData = await getFabricLoaderData(metadata.id);

        const pending = await this.getPendingResources(fabricLoaderData);

        if (pending.length > 0) {
          const info = await this.buildManifestInfo(pending);
          const confirmed = await confirmDialog(
            'Берегись! Требуется установка',
            `Будут загружены следующие компоненты:\n\n${info}\n\nПродолжайте только на свой страх и риск!`,
            { width: 750, height: 550 }
          );
          if (!confirmed) return;
        }

        await this.executeInstallation(metadata, fabricLoaderData);

        this.currentStepText = 'Конфигурация модов...';
        await configureSkinLoader();

        this.currentStepText = 'Запуск игры...';
        await launchMinecraft(metadata, fabricLoaderData);
        this.currentStepText = 'Запустить';
      } catch (err: any) {
        this.error = err.message;
        this.currentStepText = 'Ошибка';
        console.error('Launcher Error:', err);
      } finally {
        this.isBusy = false;
      }
    },

    async executeInstallation(metadata: any, fabricLoaderData: any) {
      const steps = [
        { 
          check: () => isJavaExists(), 
          action: async () => {
            this.currentStepText = 'Загрузка Java...';
            await downloadJava(this.javaFiles);
            this.currentStepText = 'Распаковка Java...';
            await extractJava(this.javaFiles);
          } 
        },
        { 
          check: () => isMinecraftExists(), 
          action: async () => {
            this.currentStepText = 'Подготовка директорий...';
            await initBaseDirs();

            this.currentStepText = 'Загрузка клиента...';
            await downloadMinecraftClient(this.clientFiles);

            this.currentStepText = 'Загрузка библиотек...';
            await downloadMinecraftLibraries(this.libraryFiles);
            
            this.currentStepText = 'Загрузка ресурсов...';

            const assetEntries = this.assetFiles.map(a => ({
              url: a.url,
              dest_path: a.destPath
            }));

            if (assetEntries.length > 0) {
              await invoke('download_assets_parallel', { 
                entries: assetEntries, 
                concurrency: 20
              });
            }

            await downloadMinecraftIndexes(this.indexFiles);
          } 
        },
        { 
          check: () => isFabricExists(fabricLoaderData), 
          action: async () => {
            this.currentStepText = 'Установка Fabric...';
            await downloadFabricInstaller(this.fabricFiles);
            await installFabric(this.fabricFiles, metadata, fabricLoaderData);
          } 
        }
      ];

      for (const step of steps) {
        if (!(await step.check())) {
          await step.action();
        }
      }

      await this.registerServerInGame();
      
      this.currentStepText = 'Синхронизация модов...';
      await syncMods(this.modFiles);
    },

    async registerServerInGame() {
      const serverStore = useServerStore();
      if (!serverStore.server) return;
      try {
        await invoke('add_server_to_list', { 
          serverName: serverStore.server.name,
          serverAddress: serverStore.server.serverAddress
        });
      } catch (err) {
        console.warn('Failed to add server to list:', err);
      }
    },

    async initManifest() {
      const serverStore = useServerStore();
      const metadata = serverStore.metadata;
      if (!metadata) return;

      const [app_data, fabric_data, mod_list] = await Promise.all([
        appDataDir(),
        getFabricMetadata(),
        getMinecraftMods(serverStore.serverId),
      ]);

      this.manifest = await buildManifestFromMetadata(metadata, fabric_data, mod_list, app_data);
    },

    async getPendingResources(fabricLoaderData: any): Promise<ResourceEntry[]> {
      const pending: ResourceEntry[] = [];

      if (!(await isJavaExists())) pending.push(...this.javaFiles);
      if (!(await isMinecraftExists())) {
        pending.push(...this.clientFiles, ...this.libraryFiles, ...this.assetFiles, ...this.indexFiles);
      }
      if (!(await isFabricExists(fabricLoaderData))) pending.push(...this.fabricFiles);
      if (!(await isModsExists(this.modFiles))) pending.push(...this.modFiles);

      return pending;
    },

    async buildManifestInfo(entries: ResourceEntry[]): Promise<string> {
      const APP_DATA = await appDataDir();
      const grouped: Record<string, ResourceEntry[]> = {};
      
      entries.forEach(entry => {
        try {
          const domain = new URL(entry.url).origin;
          if (!grouped[domain]) grouped[domain] = [];
          grouped[domain].push(entry);
        } catch {
          if (!grouped['unknown']) grouped['unknown'] = [];
          grouped['unknown'].push(entry);
        }
      });

      return Object.entries(grouped)
        .map(([domain, files]) => {
          const paths = files.slice(0, 2).map(f => f.destPath.replace(APP_DATA, '').replace(/^[/\\]+/, ''));
          const rest = files.length > 2 ? `\n  ... и еще ${files.length - 2} файлов` : '';
          return `${domain}\n  - ${paths.join('\n  - ')}${rest}`;
        })
        .join('\n\n');
    },

    async delete() {
      if (this.isBusy) return;

      const serverStore = useServerStore();
      if (!serverStore.metadata) return;

      const confirmed = await confirmDialog(
        'Удаление игры',
        'Вы точно хотите удалить игру?\n\nБудут полностью удалены файлы Java и Minecraft.',
        { width: 450, height: 250 }
      );

      if (!confirmed) return;

      this.isBusy = true;
      this.error = null;

      try {
        this.currentStepText = 'Удаление Java...';
        await deleteJava();

        this.currentStepText = 'Удаление Minecraft...';
        await deleteMinecraft();

        this.manifest = [];
        
        this.currentStepText = 'Установить';
        
      } catch (err: any) {
        this.error = 'Ошибка при удалении';
        this.currentStepText = 'Ошибка';
        console.error('Delete Error:', err);
      } finally {
        this.isBusy = false;
      }
    }
  }
});