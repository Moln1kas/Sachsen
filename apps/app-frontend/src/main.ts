import { createApp } from "vue";
import App from "./App.vue";
import FloatingVue from 'floating-vue'
import './assets/stylesheets/global.css'
import 'floating-vue/dist/style.css'

createApp(App)
.use(FloatingVue)
.mount("#app");
