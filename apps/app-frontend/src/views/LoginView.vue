<script setup lang="ts">
import { Card, Button, Text, Input, Heading } from '@repo/ui';
import { ShrimpsOceanBg } from '@repo/assets';
import { useAuthStore } from '../stores/auth.store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSocketStore } from '../stores/socket.store';
import { alertDialog } from '../core/dialog/dialog';

const auth = useAuthStore();
const router = useRouter();
const socketStore = useSocketStore();

const email = ref<string>('');
const password = ref<string>('');

const emailInputRef = ref<{ focus: () => void } | null>(null);

onMounted(() => {
  emailInputRef.value?.focus();
});

const handleLogin = async () => {
  try {
    const message = await auth.signIn(email.value, password.value);
    await socketStore.connect();
    alertDialog('Получилось!', message, { width: 330, height: 200 })
    router.push('/');
  } catch (error: any) {
    alertDialog('Не удалось войти', error);
  }
};
</script>

<template>
  <div 
    class="flex flex-col justify-center items-center w-full h-full shadow-[inset_0_0_0_1px_black]"
    :style="{ backgroundImage: `url(${ShrimpsOceanBg})` }"
  >
    <Card class="flex flex-col gap-1" type="glass">
      <Heading align="center" :level="3">Добро пожаловать!</Heading>
      <form class="flex flex-col gap-2.5" @submit.prevent="handleLogin">
        <div class="flex flex-col gap-1">
          <Input
            ref="emailInputRef"
            v-model="email"
            placeholder="Почта"
            required
            color="glass"
          />
          <Input
            v-model="password"
            placeholder="Пароль"
            type="password"
            required
            color="glass"
          />
        </div>
        <Button class="w-full">Войти</Button>
      </form>

      <Text @click="router.push('/register');" :underline="true" color="secondary">Еще нет аккаунта? Тогда вам сюда.</Text>
    </Card>
  </div>
</template>
