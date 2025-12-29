<script lang="ts" setup>
import { AdminIcon, HumanAdminIcon, HumanFriendIcon, HumanIcon, PresentIcon, SachsenIcon, TelegramIcon } from '@repo/assets';
import { Card } from '@repo/ui';
import RouteIcon from './RouteIcon.vue';
import { useUserStore } from '../../stores/user.store';
import { open } from '@tauri-apps/plugin-shell';

const userStore = useUserStore();

const openTelegram = async (url: string) => {
  await open(url);
}
</script>

<template>
  <Card class="max-w-fit h-full flex flex-col gap-1">
    <RouteIcon location="/">
      <SachsenIcon/>
    </RouteIcon>

    <RouteIcon location="/profile">
      <HumanAdminIcon v-if="userStore.user.role === 'ADMIN'"/>
      <HumanIcon v-else/>
    </RouteIcon>

    <RouteIcon location="/friends">
      <HumanFriendIcon/>
    </RouteIcon>

    <RouteIcon location="/donate">
      <PresentIcon/>
    </RouteIcon>

    <RouteIcon location="/admin" v-if="userStore.user.role === 'ADMIN'">
      <AdminIcon/>
    </RouteIcon>


    <TelegramIcon class="mt-auto cursor-pointer" @click="openTelegram('https://t.me/sachsen_launcher')"/>
  </Card>
</template>