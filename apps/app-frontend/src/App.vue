<script setup lang="ts">
  import Titlebar from '@/components/ui/Titlebar.vue';
  import { Card } from '@repo/ui';
  import { DefaultCurosrIcon } from '@repo/assets';
</script>

<template>
  <div class="w-screen h-screen bg-bgPrimary overflow-hidden">
    <Titlebar/>
    <div class="p-2 h-full">
      <Card class="">
        <p class="font-display font-medium text-xs text-fgPrimary">Текст.</p>
      </Card>
    </div>
  </div>
</template>