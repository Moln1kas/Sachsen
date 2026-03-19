import { defineStore } from 'pinia'
import { getProfile } from '../api/user.api';
import User, { UserStatus } from '../types/user.type';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User,
  }),
  actions: {
    async loadUser() {
      try {
        const user = await getProfile();
        this.user = user;
      } catch(error: any) {
        console.warn('Не удалось загрузить профиль.');
        throw error;
      }
    },

    async setStatus(status: UserStatus) {
      this.user.status = status;
    },

    async setSkinHash(skinHash: string) {
      this.user.skinHash = skinHash;
    }
  },
});