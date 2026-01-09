<script lang="ts" setup>
import { AdminIcon, BlogIcon, HumanAdminIcon, HumanFriendIcon, HumanIcon, PresentIcon, SachsenIcon, ShrimpIcon, TelegramIcon } from '@repo/assets';
import { Card } from '@repo/ui';
import RouteIcon from './RouteIcon.vue';
import { useUserStore } from '../../stores/user.store';
import { open } from '@tauri-apps/plugin-shell';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

const adminOpen = ref(false);

watch(() => route.path, (newPath) => {
  if (!newPath.startsWith('/admin')) {
    adminOpen.value = false;
  } else {
    adminOpen.value = true;
  }
});

const openTelegram = async (url: string) => {
  await open(url);
}

const adminSubroutes = [
  { location: '/admin/blogs', icon: BlogIcon },
  { location: '/admin/users', icon: HumanIcon },
];
</script>

<template>
  <Card class="max-w-fit h-full flex flex-col gap-1">
    <RouteIcon location="/">
      <SachsenIcon/>
    </RouteIcon>

    <RouteIcon location="/profile">
      <HumanAdminIcon v-if="userStore.user.role === 'ADMIN'"/>
      <HumanAdminIcon v-else-if="userStore.user.role === 'OWNER'"/>
      <HumanIcon v-else/>
    </RouteIcon>

    <RouteIcon location="/friends">
      <HumanFriendIcon/>
    </RouteIcon>

    <RouteIcon location="/donate">
      <PresentIcon/>
    </RouteIcon>

    <div v-if="userStore.user.role === 'ADMIN' || userStore.user.role === 'OWNER'">
      <div class="flex items-center gap-2 cursor-pointer select-none">
        <RouteIcon location="/admin" :activeParent="true">
          <AdminIcon />
        </RouteIcon>
      </div>

      <transition-group v-if="adminOpen" name="slide-fade" tag="div" class="mt-1 flex flex-col gap-1">
        <RouteIcon
          v-for="(item, index) in adminSubroutes"
          :key="item.location"
          :location="item.location"
          class="bounce-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <component :is="item.icon" />
        </RouteIcon>
      </transition-group>
    </div>


    <TelegramIcon class="mt-auto cursor-pointer" @click="openTelegram('https://t.me/sachsen_launcher')"/>
  </Card>
</template>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.bounce-item {
  animation: bounce-in 0.4s forwards;
}
</style>