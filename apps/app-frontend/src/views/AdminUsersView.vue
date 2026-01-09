<script lang="ts" setup>
import { Card, Button } from '@repo/ui';
import UserCard from '../components/ui/UserCard.vue';
import { getUsers, banUser, unbanUser } from '../api/admin/users/users.api';
import { onMounted, ref } from 'vue';
import { Users } from '../types/user.type';
import { alertDialog } from '../core/dialog/dialog';
import { LockIcon, UnlockIcon } from '@repo/assets';

const users = ref<Users>();

onMounted(async () => {
  await updateUsers();
});

const updateUsers = async () => {
  users.value = await getUsers(1, 10);
}

const handleBan = async (userId: number) => {
  try {
    await banUser(userId)
    await updateUsers();
    alertDialog('Игрок забанен', 'Вы успешно забанили игрока.', {
      width: 300,
      height: 200
    })
  } catch(err) {
    alertDialog('Не удалось забанить', `${err}`, { 
      width: 300,
      height: 200
    });
  }
}

const handleUnban = async (userId: number) => {
  try {
    await unbanUser(userId)
    await updateUsers();
    alertDialog('Игрок разбанены', 'Вы успешно разбанили игрока.', {
      width: 300,
      height: 200
    })
  } catch(err) {
    alertDialog('Не удалось разбанить', `${err}`, { 
      width: 300,
      height: 200
    });
  }
}
</script>

<template>
  <div class="flex gap-2 w-full h-full">
    <Card class="w-full overflow-y-auto">
      <div class="flex flex-col gap-1">
        <UserCard
          v-for="user in users?.users"

          :key="user.id"
          :username="user.username"
          :role="user.role"
          :status="user.status"
          :is-online="!!user.isOnline"
        >
          <template #actions>
            <Button type="approve" class="w-8 h-8 mr-1" @click="handleUnban(user.id)">
              <UnlockIcon class="fill-fgPrimary"/>
            </Button>
            <Button type="danger" class="w-8 h-8 mr-1" @click="handleBan(user.id)">
              <LockIcon class="fill-fgPrimary"/>
            </Button>
          </template>
        </UserCard>
      </div>
    </Card>
  </div>

</template>