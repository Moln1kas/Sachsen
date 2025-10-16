<script setup lang="ts">
import { FolderIcon, TrashcanIcon } from '@repo/assets';
import { Button, Card, Heading } from '@repo/ui';
import { openPath } from '@tauri-apps/plugin-opener';
import { appDataDir } from '@tauri-apps/api/path';
import { useLauncherStore } from '../../stores/launcher.store';
import { onMounted } from 'vue';
import { useUserStore } from '../../stores/user.store';

const launcherStore = useLauncherStore();
const userStore = useUserStore();

onMounted(async () => {
  if (!(await launcherStore.isInstalled())) {
    await launcherStore.setButtonText('Установить');
  }

  await launcherStore.disableButton(true);

  switch(userStore.user.status) {
    case 'PENDING':
      await launcherStore.setStatus('Ваш аккаунт еще не подтвержден администратором!');
      return;
    case 'REJECTED':
      await launcherStore.setStatus('Ваша заявка на вход отклонена!');
      return;
    case 'BANNED':
      await launcherStore.setStatus('Ваш аккаунт заблокирован!');
      return;
    case 'APPROVED':
      await launcherStore.disableButton(false);
  }
});

const handleOpenGameFolder = async () => {
  const appData = await appDataDir();
  await openPath(appData);
}
</script>

<template>
  <Card>
    <div class="flex items-center justify-between mb-2">
    <Button 
      :disabled="launcherStore.isButtonDisabled" 
      @click="launcherStore.launch" 
      class="w-full h-10 mr-2" 
      type="accent"
    >{{ launcherStore.buttonText }}</Button>

    <div class="flex gap-0.5">
      <Button @click="handleOpenGameFolder" class="w-10 h-10">
        <FolderIcon/>
      </Button>
      <Button @click="launcherStore.delete" class="w-10 h-10">
        <TrashcanIcon/>
      </Button>
    </div>
    </div>

    <Heading color="dark" :level="6">Текущий статус: {{ launcherStore.status }}</Heading>
  </Card>
</template>