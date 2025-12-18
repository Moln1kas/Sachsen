import { defineStore } from 'pinia'
import Server from '../types/server.type';
import { getMinecraftMetadata, getMinecraftServer, getMinecraftServerList } from '../api/minecraft.api';

export const useServerStore = defineStore('server', {
  state: () => ({
    serverId: 1 as number,
    server: undefined as Server | undefined,
    metadata: {} as any
  }),
  actions: {
    async loadServer() {
      try {
        const servers = await getMinecraftServerList();
        if(!servers.length) console.warn('список серверов пуст');

        this.serverId = servers[0].id;
        this.server = await getMinecraftServer(this.serverId);
      } catch(err: any) {
        console.warn('Не удалось загрузить майнкрафт сервер.');
      }
    },

    async loadMetadata() {
      if (!this.server) {
        console.warn('Нет данных о сервере для загрузки метаданных.');
        this.metadata = null;
        return null;
      }

      try {
        const metadata = await getMinecraftMetadata(
          this.server.minecraftVersionHash,
          this.server.minecraftVersion
        );

        this.metadata = metadata;
      } catch(err: any) {
        console.warn('Не удалось загрузить майнкрафт метаданные.');
        this.metadata = null;
      }
    }
  },
});