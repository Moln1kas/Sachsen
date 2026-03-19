<script lang="ts" setup>
import { Card, Button, Text } from '@repo/ui';
import { formatLocalDate } from '@repo/utils';
import UserCard from '../components/ui/UserCard.vue';
import { getUsers, banUser, unbanUser, approveUser, rejectUser, makeAdminUser, makeOwnerUser, makePlayerUser } from '../api/admin/users/users.api';
import { onMounted, ref } from 'vue';
import { Users } from '../types/user.type';
import { alertDialog, confirmDialog } from '../core/dialog/dialog';
import { ApplyIcon, CrossIcon, HumanAdminIcon, HumanIcon, LockIcon, ShrimpIcon, UnlockIcon } from '@repo/assets';

const users = ref<Users>();

onMounted(async () => {
  await updateUsers();
});

const updateUsers = async () => {
  users.value = await getUsers(1, 10);
}

const handleBan = async (userId: number) => {
  const confirm = await confirmDialog(
    'Подтвердите бан', 
    'Вы уверены, что хотите забанить этого игрока?',
    {
      width: 300,
      height: 200
    },
  );
  if(!confirm) return;
  try {
    await banUser(userId)
    await updateUsers();
    
    await alertDialog(
      'Игрок забанен', 
      'Вы успешно забанили игрока.', 
      {
        width: 300,
        height: 200
      },
    );
  } catch(err) {
    await alertDialog(
      'Не удалось забанить', 
      `${err}`, 
      {
        width: 300,
        height: 200,
      }
    );
  }
}

const handleUnban = async (userId: number) => {
  const confirm = await confirmDialog(
    'Подтвердите разбан', 
    'Вы уверены, что хотите разбанить этого игрока?',
    {
      width: 300,
      height: 200
    },
  );
  if(!confirm) return;
  try {
    await unbanUser(userId)
    await updateUsers();

    await alertDialog(
      'Игрок разбанены',
      'Вы успешно разбанили игрока.', 
      {
        width: 300,
        height: 200
      }
    );
  } catch(err) {
    await alertDialog(
      'Не удалось разбанить', 
      `${err}`, 
      { 
      width: 300,
      height: 200,
      }
    );
  }
}

const handleApprove = async (userId: number) => {
  const confirm = await confirmDialog(
    'Подтвердите одобрение', 
    'Вы уверены, что хотите одобрить заявку этого игрока?',
    {
      width: 300,
      height: 200
    },
  );
  if(!confirm) return;
  try {
    await approveUser(userId)
    await updateUsers();
    
    await alertDialog(
      'Заявка одобрена', 
      'Вы успешно одобрили заявку игрока.', 
      {
        width: 300,
        height: 200
      },
    );
  } catch(err) {
    await alertDialog(
      'Не удалось одобрить', 
      `${err}`, 
      {
        width: 300,
        height: 200,
      }
    );
  }
}

const handleReject = async (userId: number) => {
  const confirm = await confirmDialog(
    'Подтвердите отклонение', 
    'Вы уверены, что хотите отклонить заявку этого игрока?',
    {
      width: 300,
      height: 200
    },
  );
  if(!confirm) return;
  try {
    await rejectUser(userId)
    await updateUsers();
    
    await alertDialog(
      'Заявка отклонена', 
      'Вы успешно отклонили заявку игрока.', 
      {
        width: 300,
        height: 200
      },
    );
  } catch(err) {
    await alertDialog(
      'Не удалось отклонить', 
      `${err}`, 
      {
        width: 300,
        height: 200,
      }
    );
  }
}

const handleChangeRole = async (userId: number, role: 'ADMIN' | 'OWNER' | 'PLAYER') => {
  const confirm = await confirmDialog(
    'Изменение роли', 
    'Вы уверены, что хотите изменить роль этого игрока?',
    {
      width: 300,
      height: 200
    },
  );
  if(!confirm) return;
  try {
    switch (role) {
      case 'ADMIN':
        await makeAdminUser(userId);
        break;
      case 'OWNER':
        await makeOwnerUser(userId);
        break;
      case 'PLAYER':
        await makePlayerUser(userId);
        break;
    }
    await updateUsers();
    
    await alertDialog(
      'Назначение успешно', 
      'Вы успешно изменили роль игрока.', 
      {
        width: 300,
        height: 200
      },
    );
  } catch(err) {
    await alertDialog(
      'Не удалось назначить', 
      `${err}`, 
      {
        width: 300,
        height: 200,
      }
    );
  }
}
</script>

<template>
  <div class="flex gap-2 w-full h-full">
    <Card class="w-full overflow-y-auto">
      <div class="flex flex-col gap-1">
        <UserCard
          v-if="users"
          v-for="user in users.users"

          :key="user.id"
          :username="user.username"
          :role="user.role"
          :status="user.status"
          :is-online="!!user.isOnline"
          :skin-hash="user.skinHash"
        >
          <template #actions>
            <div class="flex gap-2">
              <!-- Заявки -->
              <div class="flex gap-1" v-if="user.status === 'PENDING' || user.status === 'REJECTED'">
                <Button type="accent" class="w-8 h-8" @click="handleApprove(user.id)">
                  <ApplyIcon class="fill-fgPrimary"/>
                </Button>
                <Button type="danger" class="w-8 h-8" @click="handleReject(user.id)">
                  <CrossIcon class="fill-fgPrimary"/>
                </Button>
              </div>

              <!-- Роли -->
              <div class="flex gap-1" v-if="user.status !== 'PENDING' && user.status !== 'REJECTED'">
                <ShrimpIcon 
                  :class="'w-8 h-8 transition ' + (user.role === 'OWNER' ? 'scale-125' : '')"
                  @click="handleChangeRole(user.id, 'OWNER')"
                ></ShrimpIcon>
                <HumanAdminIcon 
                  :class="'w-8 h-8 transition ' + (user.role === 'ADMIN' ? 'scale-125' : '')"
                  @click="handleChangeRole(user.id, 'ADMIN')"
                />
                <HumanIcon
                  :class="'w-8 h-8 transition ' + (user.role === 'PLAYER' ? 'scale-125' : '')"
                  @click="handleChangeRole(user.id, 'PLAYER')"
                />
              </div>

              <!-- Баны/Разбаны -->
              <div class="flex gap-1">
                <Button type="approve" class="w-8 h-8" @click="handleUnban(user.id)">
                  <UnlockIcon class="fill-fgPrimary"/>
                </Button>
                <Button type="danger" class="w-8 h-8" @click="handleBan(user.id)">
                  <LockIcon class="fill-fgPrimary"/>
                </Button>
              </div>
            </div>
          </template>

          <template #description>
            <div class="flex flex-col gap-2.5">
              <Card>
                <Text size="sm">
                  {{ user.applicationText }}
                </Text>
              </Card>
              <Text v-if="user.createdAt" size="sm" color="dark" weight="bold">
                Аккаунт создан: {{ formatLocalDate(user.createdAt) }}
              </Text>
            </div>
          </template>
        </UserCard>
      </div>
    </Card>
  </div>

</template>