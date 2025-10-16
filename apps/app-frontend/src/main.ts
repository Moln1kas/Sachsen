import { createApp } from "vue";
import App from "./views/App.vue";
import FloatingVue from 'floating-vue';
import './assets/stylesheets/global.css';
import 'floating-vue/dist/style.css';
import { router } from "./routers/router";
import { createPinia } from 'pinia';
import { useAuthStore } from "./stores/auth.store";
import { useUserStore } from "./stores/user.store";

const app = createApp(App);
const pinia = createPinia();

app.use(FloatingVue);
app.use(pinia);

const auth = useAuthStore();
const user = useUserStore();

await auth.loadTokens();
await user.loadUser();

app.use(router);

app.mount("#app");
