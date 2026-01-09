import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './auth.store';
import { useUserStore } from './user.store';
import { router } from '../routers/router';
import { UserStatus } from '../types/user.type';

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

      this.socket.on('user:banned', async () => {
        const userStore = useUserStore();

        userStore.setStatus(UserStatus.BANNED);
        await router.replace({ name: 'Ban' });
      });
    },

    async disconnect() {
      await this.socket.disconnect();
      console.log('Disconnected');
    },
  },
});