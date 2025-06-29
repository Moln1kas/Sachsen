import { defineStore } from 'pinia'
import { logout, signIn, signUp } from '../api/auth.api';
import Answer from '../types/answer';
import { clearTokens, getTokens, setTokens } from '../core/db/auth.db';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: null as string | null,
		refreshToken: null as string | null,
	}),
	actions: {
		async signIn(email: string, password: string) {
			try {
				const data = await signIn(email, password);
				await this.saveTokens(data.access_token, data.refresh_token)
				return data.message;
			} catch (error) {
				throw error;
			}
		},

		async signUp(
			email: string, 
			username: string, 
			password: string,
			answers: Answer[]
		) {
			try {
				const data = await signUp(email, username, password, answers);
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
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
      } catch(err: any) {
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
      if(!this.refreshToken) return;
      await logout(this.refreshToken);
      await clearTokens();
      this.accessToken = null;
      this.refreshToken = null;
    },
	},
});