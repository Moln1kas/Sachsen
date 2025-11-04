import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './auth.store';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: {} as Socket,
  }),
  actions: {
    async connect() {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
      const authStore = await useAuthStore();

      this.socket = await io(SOCKET_URL, {
        auth: { token: authStore.accessToken }
      });

      this.socket.on('connect', () => {
        console.log('Connected');
      });
    },

    async disconnect() {
      await this.socket.disconnect();
      console.log('Disconnected');
    }
  },
});