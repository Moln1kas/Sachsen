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

const app = createApp(App);
const pinia = createPinia();

app.use(FloatingVue);
app.use(pinia);

const auth = useAuthStore();
const user = useUserStore();
const socketStore = useSocketStore();
const serverStore = useServerStore();

await auth.loadTokens();
await user.loadUser();
await socketStore.connect();
await serverStore.loadServer();
await serverStore.loadMetadata();

app.use(router);

app.mount("#app");
