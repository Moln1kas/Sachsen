<script setup lang="ts">
import { Card, Button, Heading, Text } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, TrashcanIcon } from '@repo/assets';
import { getProfile } from '../api/user.api';
import { onMounted, ref } from 'vue';

const auth = useAuthStore();
const router = useRouter();

const user = ref();
const isLoaded = ref<boolean>(false);

onMounted(async () => {
  user.value = await getProfile();
  isLoaded.value = true;
});


const handleLogout = async () => {
  await auth.logout();
  router.push('/login');
}
</script>

<template>
  <Card>
    <Heading class="mb-2" align="center" color="dark" :level="3">Ваш профиль</Heading>
    <Card type="dark" class="mb-2 flex gap-2">
      <div>
        <Card class="w-32 h-44"></Card>
      </div>
      <div v-if="isLoaded">
        <Text><span class="text-fgDark">Никнейм: </span> {{ user.username }}</Text>
        <Text><span class="text-fgDark">Роль: </span> {{ user.role }}</Text>
        <Text><span class="text-fgDark">Статус: </span> {{ user.status }}</Text>
        <Text><span class="text-fgDark">Database ID: </span> {{ user.id }}</Text>
      </div>
    </Card>


    <div class="flex gap-0.5">
      <Button class="w-full" @click="handleLogout">
        <ExitIcon/> Выйти
      </Button>
      <Button class="w-full" @click="handleLogout">
        <TrashcanIcon/> Удалить
      </Button>
    </div>
  </Card>
</template>
