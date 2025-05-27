<script setup lang="ts">
import Titlebar from '@/components/ui/Titlebar.vue';
import Sidebar from '../components/ui/Sidebar.vue';
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <Titlebar/>
    <div class="flex flex-1 overflow-hidden">
      <Sidebar class="h-full" />
      <main class="flex-1 p-2 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>