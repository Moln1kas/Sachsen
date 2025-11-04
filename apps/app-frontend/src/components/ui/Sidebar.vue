<script lang="ts" setup>
import { AdminIcon, HumanAdminIcon, HumanFriendIcon, HumanIcon, PresentIcon, SachsenIcon, TelegramIcon } from '@repo/assets';
import { Card } from '@repo/ui';
import SidebarIcon from './SidebarIcon.vue';
import { useUserStore } from '../../stores/user.store';
import { open } from '@tauri-apps/plugin-shell';

const userStore = useUserStore();

const openTelegram = async (url: string) => {
  await open(url);
}
</script>

<template>
  <Card class="max-w-fit h-full flex flex-col">
    <SidebarIcon location="/">
      <SachsenIcon/>
    </SidebarIcon>

    <SidebarIcon location="/profile">
      <HumanAdminIcon v-if="userStore.user.role === 'ADMIN'"/>
      <HumanIcon v-else/>
    </SidebarIcon>

    <SidebarIcon location="/friends">
      <HumanFriendIcon/>
    </SidebarIcon>

    <SidebarIcon location="/donate">
      <PresentIcon/>
    </SidebarIcon>

    <SidebarIcon location="/admin" v-if="userStore.user.role === 'ADMIN'">
      <AdminIcon/>
    </SidebarIcon>


    <TelegramIcon class="mt-auto cursor-pointer" @click="openTelegram('https://t.me/sachsen_launcher')"/>
  </Card>
</template>