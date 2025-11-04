import { defineStore } from 'pinia'
import Server from '../types/server.type';
import { getMinecraftMetadata, getMinecraftServer, getMinecraftServerList } from '../api/minecraft.api';

export const useServerStore = defineStore('server', {
  state: () => ({
    serverId: 1 as number,
    server: {} as Server,
    metadata: {} as any
  }),
  actions: {
    async loadServer() {
      try {
        const servers = await getMinecraftServerList();
        this.serverId = servers[0].id;
      } catch(err: any) {
        console.warn('Не удалось загрузить майнкрафт сервер.');
      }

      try {
        const server = await getMinecraftServer(this.serverId);
        this.server = server;
      } catch(err: any) {
        console.warn('Не удалось загрузить майнкрафт сервер.');
      }
    },

    async loadMetadata() {
      try {
        const metadata = await getMinecraftMetadata(
          this.server.minecraftVersionHash,
          this.server.minecraftVersion
        );
        this.metadata = metadata;
      } catch(err: any) {
        console.warn('Не удалось загрузить майнкрафт метаданные.');
      }
    }
  },
});