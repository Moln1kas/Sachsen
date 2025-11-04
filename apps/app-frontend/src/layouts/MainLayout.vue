<script setup lang="ts">
import Titlebar from '@/components/ui/Titlebar.vue';
import Sidebar from '../components/ui/Sidebar.vue';
import Playbar from '../components/ui/Playbar.vue';
import Serverbar from '../components/ui/Serverbar.vue';
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <Titlebar />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar class="h-full" />
      <div class="flex flex-col flex-1 overflow-hidden">
        <main class="flex-1 overflow-hidden p-2 pb-0">
          <RouterView />
        </main>
        <Playbar class="shrink-0 m-2" />
        <Serverbar class="shrink-0 m-2 mt-0"/>
      </div>
    </div>
  </div>
</template>
