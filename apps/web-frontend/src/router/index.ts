import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { BaseLayout } from '@repo/ui'
import { DefineComponent } from 'vue'
import PrivacyView from '../views/PrivacyView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BaseLayout as DefineComponent,
      children: [
        { path: '', name: 'Home', component: HomeView },
        { path: 'privacy', name: 'Privacy', component: PrivacyView },
      ],
    },
  ],
})

export default router
