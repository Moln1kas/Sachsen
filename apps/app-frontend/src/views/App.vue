<script setup lang="ts">
import { onMounted } from 'vue';
import { useLauncherStore } from '../stores/launcher.store';

const launcher = useLauncherStore();

onMounted(async () => {
  await launcher.initManifest();
});
</script>

<template>
  <div class="w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <RouterView/>
  </div>
</template>