<script setup lang="ts">
import { Card, Button, Heading, Text, Stamp } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, HumanAdminIcon, HumanIcon, TrashcanIcon } from '@repo/assets';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import { getUserStatus } from '../api/user.api';
import { useSocketStore } from '../stores/socket.store';
import { uploadUserSkin } from '../api/skins.api';

const authStore = useAuthStore();
const userStore = useUserStore();
const socketStore = useSocketStore();
const router = useRouter();

const userStatus = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const accountStatus = ref<Record<string, string>>({ 'text': '', 'color': ''});

onMounted(async () => {
  userStatus.value = await getUserStatus(userStore.user.id);
  
  switch (userStore.user.status) {
    case 'APPROVED':
      accountStatus.value = {'text': 'Подтвержден', 'color': 'green'};
      break;
    case 'PENDING':
      accountStatus.value = {'text': 'На рассмотрении', 'color': 'blue'};
      break;
    case 'BANNED':
      accountStatus.value = {'text': 'Забанен', 'color': 'red'};
      break;
    case 'REJECTED':
      accountStatus.value = {'text': 'Отклонен', 'color': 'red'};
      break;
  }

  isLoaded.value = true;
});

// --- --- ---

const file = ref(null);
const uploadedUrl = ref('');

const onFileChange = (e: any) => {
  const selected = e.target.files[0];
  if (!selected) return;

  if (selected.type !== 'image/png') {
    alert('Only PNG files allowed');
    return;
  }

  file.value = selected;
}

const uploadSkin = async () => {
  if (!file.value) return;

  uploadedUrl.value = await uploadUserSkin(file.value)
  alert(uploadedUrl.value);
}

// --- --- ---

const handleLogout = async () => {
  await socketStore.disconnect();
  await authStore.logout();
  router.push('/login');
}

const handleDeleteAccount = async () => {
  await socketStore.disconnect();
  await authStore.deleteAccount();
  router.push('/login');
}
</script>

<template>
  <Card>
    <Heading class="mb-2" align="center" color="dark" :level="3">
      Ваш профиль 
      (  
      <span v-if="userStatus" class="text-success">В СЕТИ</span>
      <span v-else class="text-error">НЕ В СЕТИ</span>
      )
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
                <HumanIcon v-else/>
              </div>
              <Text size="lg" class="font-semibold">{{ userStore.user.role }}</Text>
            </div>
          </div>
          <div>
            <Text class="mb-2" size="sm" color="secondary">Статус аккаунта</Text>
            <Stamp :text="accountStatus.text" :color="accountStatus.color" />
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
