<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button, Heading } from '@repo/ui';
import { UnderlineIcon, CrossIcon } from '@repo/assets';
import { onMounted, ref } from 'vue';

const appWindow = getCurrentWindow();
const appName = ref<string>('Meow');
const close = () => appWindow.close();
const minimize = () => appWindow.minimize();

const move = (e: MouseEvent) => {
  if (e.buttons === 1) {
    appWindow.startDragging();
  }
}

onMounted(async () => {
  appName.value = await appWindow.title();
});
</script>

<template>
  <header 
    @mousedown="move" 
    class="h-10 flex items-center bg-accent text-fgPrimary select-none p-1 ps-2 pe-2 shadow-[inset_0_0_0_1px_black] cursor-custom-move"
  >
    <Heading class=" w-full">
      {{ appName }}
    </Heading>
    <div class="flex justify-end">
      <Button class="w-8 h-8 mr-0.5" @mousedown.stop @click="minimize">
        <UnderlineIcon/>
      </Button>
      <Button class="w-8 h-8" @mousedown.stop @click="close">
        <CrossIcon/>
      </Button>
    </div>
  </header>
</template>