<script setup lang="ts">
import { Card, Button, Heading, Text } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, TrashcanIcon } from '@repo/assets';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const isLoaded = ref<boolean>(false);

onMounted(async () => {
  isLoaded.value = true;
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
}

const handleDeleteAccount = async () => {
  await authStore.deleteAccount();
  router.push('/login');
}
</script>

<template>
  <Card>
    <Heading class="mb-2" align="center" color="dark" :level="3">Ваш профиль</Heading>

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
            <Text size="lg" class="font-semibold">{{ userStore.user.role }}</Text>
          </div>
          <div>
            <Text size="sm" color="secondary">Статус</Text>
            <Text size="lg" class="font-semibold">{{ userStore.user.status }}</Text>
          </div>
        </div>
      </Card>

      <div class="flex flex-col gap-1 w-full md:w-40">
        <Button class="w-full" @click="">
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
