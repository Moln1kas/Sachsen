<script setup lang="ts">
import Titlebar from '@/components/ui/Titlebar.vue';
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <Titlebar />
    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-hidden">
        <main class="flex-1 overflow-auto p-2">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
