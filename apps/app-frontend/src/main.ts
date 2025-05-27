import { createApp } from "vue";
import App from "./views/App.vue";
import FloatingVue from 'floating-vue';
import './assets/stylesheets/global.css';
import 'floating-vue/dist/style.css';
import { router } from "./routers/router";

createApp(App)
.use(FloatingVue)
.use(router)
.mount("#app");
