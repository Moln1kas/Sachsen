import { 
  createMemoryHistory, 
  createRouter, 
  RouteRecordRaw 
} from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import { useAuthStore } from '../stores/auth.store';
import LoginView from '../views/LoginView.vue';
import SimpleLayout from '../layouts/SimpleLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView, meta: { requiresAuth: true } },
      { path: 'profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
    ],

  },
  {
    path: '/',
    component: SimpleLayout,
    children: [
      { path: '/login', component: LoginView, name: 'Login' }
    ]
  }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach(async (to, _) => {
  const auth = useAuthStore();

  if (
    !auth.isAuthenticated() && 
    to.meta.requiresAuth === true
  ) {
    return { name: 'Login' }
  }
});