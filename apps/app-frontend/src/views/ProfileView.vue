<script setup lang="ts">
import { Card, Button, Heading, Text, OnlineStatus, UserStatusStamp, Input } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, HumanAdminIcon, HumanIcon, ReloadIcon, ShrimpIcon, SteaveSkin, TrashcanIcon } from '@repo/assets';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import { getUserStatus } from '../api/user.api';
import { useSocketStore } from '../stores/socket.store';
import { getUserSkin, uploadUserSkin } from '../api/skins.api';
import { alertDialog, confirmDialog, promptDialog } from '../core/dialog/dialog';
import { SkinViewer } from "skinview3d";

const authStore = useAuthStore();
const userStore = useUserStore();
const socketStore = useSocketStore();
const router = useRouter();

const userStatus = ref<boolean>(false);
const isLoaded = ref<boolean>(false);

const skinFile = ref<{ el: HTMLInputElement } | null>(null)
const viewerRef = ref<HTMLCanvasElement | undefined>(undefined);
const skinViewer = ref<SkinViewer | null>(null);

onMounted(async () => {
  userStatus.value = await getUserStatus(userStore.user.id);
  isLoaded.value = true;

  const initialSkinUrl = userStore.user.skinHash 
  ? await getUserSkin(userStore.user.skinHash)
  : SteaveSkin;

  skinViewer.value = new SkinViewer({
    width: 128,
    height: 176,
    canvas: viewerRef.value,
    skin: initialSkinUrl,
  });
});

const changeSkin = async (e: any) => {
  const selected = e.target.files[0];
  if (!selected) return;

  if (selected.type !== 'image/png') {
    alertDialog('Ошибка', 'Файл должен быть в формате PNG.');
    return;
  }

  const file = selected;
  if (!file) return;

  const confirm = await confirmDialog(
    'Загрузить скин?', 
    `Вы сами несете ответственность за загружаемый файл. В случае нарушения правил, ваш аккаунт может быть заблокирован.`
  );
  if(!confirm) return;

  try {
    const uploadedUrl = await uploadUserSkin(file);
    const skin = await getUserSkin(uploadedUrl.hash);
    skinViewer.value?.loadSkin(skin);
    userStore.setSkinHash(uploadedUrl.hash);
    await alertDialog(
      'Скин загружен', 
      'Ваш скин успешно изменен. Изменения могут отобразиться не сразу.',
      { width: 300, height: 200 }
    );
  } catch (error) {
    await alertDialog('Ошибка загрузки', `${error}`);
    return;
  }
}

const handleLogout = async () => {
  const confirm = await confirmDialog('Выйти из аккаунта?', `Вы точно уверены, что хотите выйти из аккаунта? Вы сможете войти обратно если имеете данные для входа.`);
  if(!confirm) return;
  await socketStore.disconnect();
  await authStore.logout();
  router.push('/login');
}

const handleDeleteAccount = async () => {
  const prompt = await promptDialog('Удалить аккаунт?', `Вы потеряете весь свой прогресс без возможности восстановления. Чтобы подтвердить это действие, введите в поле свой никнейм.`, `Никнейм`);
  if(prompt !== userStore.user.username) {
    await alertDialog('Аккаунт НЕ удален', 'Никнейм указан неверно, аккаунт не удален.')
    return;
  }
  await socketStore.disconnect();
  await authStore.deleteAccount();
  router.push('/login');
}
</script>

<template>
  <Card>
    <Heading class="mb-2" align="center" color="dark" :level="3">
      Ваш профиль 
      <OnlineStatus :is-online="userStatus"/>
    </Heading>

    <div class="flex flex-col md:flex-row gap-2">
      <Card type="dark" class="flex-1 flex gap-4">
        <div>
          <Card class="w-32 h-44 flex items-center justify-center">
            <canvas ref="viewerRef"></canvas>
          </Card>
        </div>

        <div v-if="isLoaded" class="space-y-2">
          <div>
            <Text size="sm" color="secondary">Никнейм</Text>
            <Text size="lg" class="font-semibold">{{ userStore.user.username }}</Text>
          </div>
          <div>
            <Text size="sm" color="secondary">Роль</Text>
            <div class="flex items-center gap-1">
              <div class="w-8 h-8">
                <HumanAdminIcon v-if="userStore.user.role === 'ADMIN'"/>
                <ShrimpIcon v-else-if="userStore.user.role === 'OWNER'"/>
                <HumanIcon v-else/>
              </div>
              <Text size="lg" class="font-semibold">{{ userStore.user.role }}</Text>
            </div>
          </div>
          <div>
            <Text class="mb-2" size="sm" color="secondary">Статус аккаунта</Text>
            <UserStatusStamp :status="userStore.user.status" />
          </div>
        </div>
      </Card>

      <div class="flex flex-col gap-1 w-full md:w-40">
        <Input type="file" accept=".png" @change="changeSkin" ref="skinFile" class="hidden"/>
        <Button class="w-full" @click="skinFile?.el?.click()">
          <ReloadIcon/> Сменить скин
        </Button>
        <Button class="w-full" @click="handleLogout">
          <ExitIcon/> Выйти
        </Button>
        <Button class="w-full" @click="handleDeleteAccount">
          <TrashcanIcon/> Удалить
        </Button>
      </div>
    </div>
  </Card>
</template>
