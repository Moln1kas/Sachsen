<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Button } from '@repo/ui';
import { UnderlineIcon, CrossIcon } from '@repo/assets';

const appWindow = getCurrentWindow();

const close = () => appWindow.close();
const minimize = () => appWindow.minimize();

const move = (e: MouseEvent) => {
  if (e.buttons === 1) {
    appWindow.startDragging();
  }
}
</script>

<template>
  <header 
    @mousedown="move" 
    class="bg-accent text-fgPrimary select-none flex p-2 ps-3 pe-3 text-sm shadow-[inset_0_0_0_1px_black] cursor-custom-move"
  >
    <div class="w-full flex justify-end">
      <Button @mousedown.stop @click="minimize">
        <UnderlineIcon/>
      </Button>
      <Button @mousedown.stop @click="close">
        <CrossIcon/>
      </Button>
    </div>
  </header>
</template>