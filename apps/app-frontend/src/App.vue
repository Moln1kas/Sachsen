<script setup lang="ts">
  import { Test } from '@repo/ui'
  import { AdminIcon } from '@repo/assets';
  import Titlebar from '@/components/ui/Titlebar.vue';
</script>

<template>
  <div class="w-screen h-screen bg-bgPrimary">
    <Titlebar/>
    <h1 class="text-fg">ABOBA</h1>
    <Test/>
    <AdminIcon/>
  </div>
</template>