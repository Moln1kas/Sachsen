import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    ready: false,
    loading: true,
    error: null as string | null,
  }),
  actions: {
    setReady() {
      this.ready = true;
      this.loading = false;
      this.error = null;
    },
    setError(msg: string) {
      this.ready = true;
      this.loading = false;
      this.error = msg;
    },
  }
});
