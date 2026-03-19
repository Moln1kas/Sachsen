<script setup lang="ts">
import { onMounted } from 'vue';
import { FolderIcon, TrashcanIcon } from '@repo/assets';
import { Button, Card } from '@repo/ui';
import { openPath } from '@tauri-apps/plugin-opener';
import { appDataDir } from '@tauri-apps/api/path';
import { useLauncherStore } from '../../stores/launcher.store';

const launcherStore = useLauncherStore();

onMounted(async () => {
  await launcherStore.initManifest();
});

const handleOpenGameFolder = async () => {
  const appData = await appDataDir();
  await openPath(appData);
}

const handleDeleteGame = async () => {
  await launcherStore.delete();
}
</script>

<template>
  <Card>
    <div class="flex items-center justify-between">
      <Button 
        :disabled="launcherStore.playButtonState.disabled" 
        @click="launcherStore.runLauncherWorkflow" 
        class="w-full h-10 mr-2" 
        type="accent"
      >
        {{ launcherStore.playButtonState.text }}
      </Button>

      <div class="flex gap-0.5">
        <Button @click="handleOpenGameFolder" class="w-10 h-10">
          <FolderIcon/>
        </Button>
        
        <Button
          :disabled="launcherStore.isBusy" 
          @click="handleDeleteGame" 
          class="w-10 h-10"
        >
          <TrashcanIcon/>
        </Button>
      </div>
    </div>
  </Card>
</template>