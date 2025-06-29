<script setup lang="ts">
import { FolderIcon, TrashcanIcon } from '@repo/assets';
import { Button, Card, Heading } from '@repo/ui';
import { ref } from 'vue';
import { openPath } from '@tauri-apps/plugin-opener';
import { appDataDir } from '@tauri-apps/api/path';
import { downloadJava } from '../../core/launcher/java.launcher';

const status = ref<string>('Текущий статус: {}');

const handleLaunchButton = async () => {
  await downloadJava();
}

const handleOpenGameFolder = async () => {
  const appData = await appDataDir();
  await openPath(appData);
}
</script>

<template>
  <Card>
    <div class="flex items-center justify-between mb-2">
    <Button @click="handleLaunchButton" class="w-full h-10 mr-2" type="accent">Запустить</Button>
      <div class="flex gap-0.5">
        <Button @click="handleOpenGameFolder" class="w-10 h-10">
          <FolderIcon/>
        </Button>
        <Button class="w-10 h-10">
          <TrashcanIcon/>
        </Button>
      </div>
    </div>
 
    <Heading color="dark" :level="6">{{ status }}</Heading>
  </Card>
</template>