<script setup lang="ts">
import { Button, Card, Heading, Text } from '@repo/ui';
import { useUserStore } from '../stores/user.store';
import { alertDialog, confirmDialog, promptDialog } from '../core/dialog/dialog';
import { useSocketStore } from '../stores/socket.store';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { ExitIcon, TrashcanIcon } from '@repo/assets';

const authStore = useAuthStore();
const userStore = useUserStore();
const socketStore = useSocketStore();
const router = useRouter();

const handleDeleteAccount = async () => {
  const prompt = await promptDialog('Удалить аккаунт?', `Может, еще не все потеряно? Вы потеряете весь свой прогресс без возможности восстановления. Чтобы подтвердить это действие, введите в поле свой никнейм.`, `Никнейм`);
  if(prompt !== userStore.user.username) {
    await alertDialog('Аккаунт НЕ удален', 'Никнейм указан неверно, аккаунт не удален.')
    return;
  }
  await socketStore.disconnect();
  await authStore.deleteAccount();
  router.push('/login');
}

const handleLogout = async () => {
  const confirm = await confirmDialog('Выйти из аккаунта?', `Вы точно уверены, что хотите выйти из аккаунта? Вы сможете войти обратно если имеете данные для входа.`);
  if(!confirm) return;
  await socketStore.disconnect();
  await authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div 
    class="flex flex-col justify-center items-center w-full h-full shadow-[inset_0_0_0_1px_black] banned-page"
  >
    <Card class="flex flex-col gap-2.5 w-128 max-h-112 overflow-y-auto">
      <div>
        <Heading color="red" align="center" :level="3">ВЫ ЗАБАНЕНЫ</Heading>
        <Heading align="center" :level="4" color="dark">{{ userStore.user.username }}</Heading>
      </div>

      <Text>Теперь лаунчер вряд ли представляет для вас какую-либо ценность. Вот то, что вы можете сделать:</Text>
      <Text color="secondary">+ Не готовы так просто сдаваться? Оспорьте свой бан. Вдруг это недоразумение.</Text>
      <Text color="secondary">+ Удалить свой аккаунт и, конечно же, создать твинка - так вы точно обойдёте систему!</Text>
      <Text color="secondary">+ Навсегда забыть про этот лаунчер. Не забудьте удалить его <span class="text-success">с опцией удаления всех данных приложения</span> - зачем засорять компьютер лишними файлами?</Text>

      <div class="flex W-full gap-0.5">
        <Button class="w-1/2" @click="handleDeleteAccount">
          <TrashcanIcon/> Удалить аккаунт
        </Button>

        <Button class="w-1/2" @click="handleLogout">
          <ExitIcon/> Выйти
        </Button>
      </div>


    </Card>
  </div>
</template>

<style scoped>
  .banned-page {
    cursor: var(--cursor-fuck);
  }

  .banned-page * {
    cursor: inherit;
  }
</style>