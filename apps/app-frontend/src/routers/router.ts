import { 
  createWebHashHistory, 
  createRouter, 
  RouteRecordRaw 
} from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import { useAuthStore } from '../stores/auth.store';
import LoginView from '../views/LoginView.vue';
import SimpleLayout from '../layouts/SimpleLayout.vue';
import RegisterView from '../views/RegisterView.vue';
import { useUserStore } from '../stores/user.store';
import FriendsView from '../views/FriendsView.vue';
import DonateView from '../views/DonateView.vue';
import AdminBlogsView from '../views/AdminBlogsView.vue';
import AdminHomeView from '../views/AdminHomeView.vue';
import BanView from '../views/BanView.vue';
import AdminUsersView from '../views/AdminUsersView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
      { path: 'profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
      { path: 'friends', name: 'Friends', component: FriendsView, meta: { requiresAuth: true } },
      { path: 'donate', name: 'Donate', component: DonateView, meta: { requiresAuth: true } },
    ],

  },
  {
    path: '/',
    component: SimpleLayout,
    children: [
      { path: 'login', component: LoginView, name: 'Login' },
      { path: 'register', component: RegisterView, name: 'Register' },
      { path: 'ban', component: BanView, name: 'Ban' }
    ]
  },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: MainLayout, 
    meta: { requiresAuth: true, requiresRole: ['ADMIN', 'OWNER'] },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: AdminHomeView,
        children: [
          { path: 'blogs', component: AdminBlogsView, name: 'AdminBlogs' },
          { path: 'users', component: AdminUsersView, name: 'AdminUsers' }
        ] 
      }
    ]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  const allowedForBanned = ['Ban', 'Login', 'Register'];

  if (!authStore.isAuthenticated() && to.meta.requiresAuth) {
    return { name: 'Login' }
  }

  if (to.meta.requiresRole) {
    const allowedRoles = to.meta.requiresRole as string[];

    if (!allowedRoles.includes(userStore.user.role)) {
      return { name: (from.name as string) || 'Home' };
    }
  }

  if (
    userStore.user.status === 'BANNED' &&
    !allowedForBanned.includes(to.name as string)
  ) {
    return { name: 'Ban'}
  }
  
});