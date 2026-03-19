import { defineStore } from 'pinia'
import { deleteAccount, logout, signIn, signUp } from '../api/auth.api';
import { clearTokens, getTokens, setTokens } from '../core/db/auth.db';
import { useUserStore } from './user.store';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: null as string | null,
		refreshToken: null as string | null,
	}),
	actions: {
		async signIn(email: string, password: string) {
      const userStore = useUserStore();
			try {
				const data = await signIn(email, password);
				await this.saveTokens(data.access_token, data.refresh_token)
        await userStore.loadUser();
				return data.message;
			} catch (error) {
				throw error;
			}
		},

		async signUp(
			email: string, 
			username: string, 
			password: string,
			applicationText: string
		) {
			try {
				const data = await signUp(email, username, password, applicationText);
				return data.message;
			} catch (error) {
				throw error;
			}
		},

    isAuthenticated(): boolean {
      return !!this.accessToken;
    },

    async loadTokens() {
      try {
        const tokens = await getTokens();

        if (!tokens?.access_token || !tokens?.refresh_token) {
          this.accessToken = null;
          this.refreshToken = null;
          return;
        }

        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
      } catch(error: any) {
        console.warn('Токены не найдены');
        this.accessToken = null;
        this.refreshToken = null;
      }
    },

    async saveTokens(access: string, refresh: string) {
      await setTokens(access, refresh);
      this.accessToken = access;
      this.refreshToken = refresh;
    },

    async logout() {
      const refresh = this.refreshToken;

      await clearTokens();

      this.accessToken = null;
      this.refreshToken = null;

      if (refresh) {
        await logout(refresh);
      }
    },

    async deleteAccount() {
      if(!this.accessToken) return;
      await deleteAccount(this.accessToken);
      await this.logout();
    },
	},
});