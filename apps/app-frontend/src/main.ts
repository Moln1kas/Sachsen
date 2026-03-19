import { createApp } from "vue";
import App from "./views/App.vue";
import FloatingVue from 'floating-vue';
import './assets/stylesheets/global.css';
import 'floating-vue/dist/style.css';
import { router } from "./routers/router";
import { createPinia } from 'pinia';
import { useAuthStore } from "./stores/auth.store";
import { useUserStore } from "./stores/user.store";
import { useSocketStore } from "./stores/socket.store";
import { useServerStore } from "./stores/server.store";
import { useAppStore } from "./stores/app.store";

const app = createApp(App);
const pinia = createPinia();

app.use(FloatingVue);
app.use(pinia);
app.use(router);

app.mount("#app");

bootstrap();

async function bootstrap() {
  const appStore = useAppStore();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const serverStore = useServerStore();
  const socketStore = useSocketStore();

  try {
    await authStore.loadTokens();

    if (authStore.isAuthenticated()) {
      try {
        await userStore.loadUser();
        await serverStore.loadServer();
        await serverStore.loadMetadata();
        await socketStore.connect();

        appStore.setReady();

        router.replace({ name: 'Home' });
      } catch (e) {
        console.error('Ошибка подключения к серверу', e);
        appStore.setError('Не удалось подключиться к серверу. Попробуйте позже.');
      }
    } else {
      appStore.setReady();
      router.replace({ name: 'Login' });
    }
  } catch (e) {
    console.error('Ошибка инициализации приложения', e);
    appStore.setError('Ошибка инициализации приложения');
  }
}
