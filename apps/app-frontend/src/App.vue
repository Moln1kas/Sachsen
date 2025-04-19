<script setup lang="ts">
  import Titlebar from '@/components/ui/Titlebar.vue';
  import { Card } from '@repo/ui';
</script>

<template>
  <div class="w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <Titlebar/>
    <div class="p-2 h-full">
      <Card>
        <p v-tooltip="'Текст.'" class="font-display font-medium text-xs text-fgPrimary w-fit">Текст.</p>
      </Card>
    </div>
  </div>
</template>