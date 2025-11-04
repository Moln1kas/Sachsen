<script setup lang="ts">
import { Card, Button, Text } from '@repo/ui';
import { useAuthStore } from '../stores/auth.store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSocketStore } from '../stores/socket.store';

const auth = useAuthStore();
const router = useRouter();
const socketStore = useSocketStore();

const email = ref<string>('');
const password = ref<string>('');

const handleLogin = async () => {
  try {
    const message = await auth.signIn(email.value, password.value) //await auth.signIn(email.value, password.value);
    await socketStore.connect();
    alert(message);
    router.push('/');
  } catch (error: any) {
    alert(`Ошибка входа: ${error}`);
  }
};
</script>

<template>
  <Card>
    <input
        v-model="email"
        placeholder="Почта"
        required
        class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
      />
    <input
        v-model="password"
        placeholder="Пароль"
        type="password"
        required
        class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
      />
    <Button class="w-full" @click="handleLogin()">Войти</Button>

    <Text @click="router.push('/register');">Нет аккаунта? Зарегистрируйтесь.</Text>
  </Card>
</template>
