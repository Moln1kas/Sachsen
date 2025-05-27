import { 
  createMemoryHistory, 
  createRouter, 
  RouteRecordRaw 
} from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
      { path: 'profile', component: ProfileView },
    ],
  },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})