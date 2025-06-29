<script lang="ts" setup>
import { HumanIcon, SachsenIcon } from '@repo/assets';
import { Card } from '@repo/ui';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isActive = (path: string) => route.path === path;
</script>

<template>
  <Card class="max-w-fit h-full">
    <div
      class="w-8 h-8 mb-1 flex items-center justify-center transition"
      :class="isActive('/') 
        ? 'bg-primary text-fgPrimary ring-2 ring-primary' 
        : 'hover:bg-muted text-muted-foreground'"
      @click="router.push('/')"
    >
      <SachsenIcon/>
    </div>

    <div
      class="w-8 h-8 mb-1 flex items-center justify-center transition"
      :class="isActive('/profile') 
        ? 'bg-primary text-fgPrimary ring-2 ring-primary' 
        : 'hover:bg-muted text-muted-foreground'"
      @click="router.push('/profile')"
    >
      <HumanIcon/>
    </div>
  </Card>
</template>