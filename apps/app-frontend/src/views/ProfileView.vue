<script setup lang="ts">
import { Card, Button, Heading, Text, OnlineStatus, UserStatusStamp } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, HumanAdminIcon, HumanIcon, ShrimpIcon, TrashcanIcon } from '@repo/assets';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import { getUserStatus } from '../api/user.api';
import { useSocketStore } from '../stores/socket.store';
import { uploadUserSkin } from '../api/skins.api';
import { alertDialog, confirmDialog, promptDialog } from '../core/dialog/dialog';

const authStore = useAuthStore();
const userStore = useUserStore();
const socketStore = useSocketStore();
const router = useRouter();

const userStatus = ref<boolean>(false);
const isLoaded = ref<boolean>(false);

onMounted(async () => {
  userStatus.value = await getUserStatus(userStore.user.id);
  isLoaded.value = true;
});

// --- ГОВНОКОД АЛАРМ!!! ---

const file = ref(null);
const uploadedUrl = ref('');

const onFileChange = (e: any) => {
  const selected = e.target.files[0];
  if (!selected) return;

  if (selected.type !== 'image/png') {
    alertDialog('Ошибка', 'Разрешены только PNG файлы.');
    return;
  }

  file.value = selected;
}

const uploadSkin = async () => {
  if (!file.value) return;

  uploadedUrl.value = await uploadUserSkin(file.value)
  alertDialog('Бо', uploadedUrl.value);
}

// --- ГОВНОКОД ТЕСТ ОНЛИ!!! ---

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
          <Card class="w-32 h-44" />
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
        <input type="file" accept=".png" @change="onFileChange" />
        <Button class="w-full" @click="uploadSkin">
          Сменить скин
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
