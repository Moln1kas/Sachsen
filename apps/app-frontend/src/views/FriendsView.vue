<script lang="ts" setup>
  import { Input, Card, Heading, Button, Text } from '@repo/ui';
  import { onMounted, ref } from 'vue';
  import User from '../types/user.type';
  import { findUserByUsername } from '../api/user.api';
  import UserCard from '../components/ui/UserCard.vue';
  import { acceptFriendRequest, createFriendRequest, getUserFriends, getUserFriendsRequests, rejectFriendRequest, removeUserFromFriends } from '../api/friends.api';
  import { useUserStore } from '../stores/user.store';
import { TrashcanIcon } from '@repo/assets';
import { customConfirm } from '../core/dialog/confirm.dialog';

  const userStore = useUserStore();

  const friendsRequests = ref<User[]>();
  const friends = ref<User[]>();

  const username = ref<string>('');

  onMounted(async () => {
    await updateData();
  });

  const updateData = async () => {
    friendsRequests.value = await getUserFriendsRequests();
    friends.value = await getUserFriends(userStore.user.id);
    console.log(friends.value)
  }

  const addFriend = async () => {
    console.log(username.value)
    try {
      const user = await findUserByUsername(username.value);

      const confirm = await customConfirm('Добавить друга?', `${user.username} появится в вашем списке друзей только после того, как он одобрит вашу заявку.`);
      if(!confirm) return;

      await createFriendRequest(user.id);
      alert('Заявка отправлена');
    } catch (err: any) {
      alert(err);
    }
  }

  const acceptFriend = async (friendId: number) => {
    await acceptFriendRequest(friendId);
    await updateData();
  }

  const rejectFriend = async (friendId: number) => {
    await rejectFriendRequest(friendId);
    await updateData();
  }

  const removeFriend = async (friendId: number) => {
    await removeUserFromFriends(friendId);
    await updateData();
  }
</script>

<template>
  <!-- <Card class="mb-2">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Поиск игроков
    </Heading>

    <div class="flex">
      <Input class="mr-1" v-model="username" placeholder="Никнейм пользователя"/>
      <Button @click="findUser">Найти</Button>
    </div>

    <div class="flex mt-2" v-if="user">
      <UserCard
        :username="user.username"
        :role="user.role"
        :status="user.status"
        :is-online="!!user.isOnline"
      >
        <template #actions>
          <Button type="approve" class="w-12" @click="addFriend">+</Button>
        </template>
      </UserCard>
    </div>
  </Card> -->

  <Card class="flex flex-col h-full min-h-0 overflow-hidden">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Ваши друзья
    </Heading>

    <div class="flex flex-col min-h-0 h-full overflow-y-auto pr-2 gap-2.5">
      <div class="flex flex-col gap-2.5">
        <UserCard
          v-if="friendsRequests?.length != 0"
          v-for="user in friendsRequests"

          :key="user.id"
          :username="user.username"
          :role="user.role"
          :status="user.status"
          :is-online="!!user.isOnline"

          class="mr-1 border-success border-2"
        >
          <template #actions>
            <Button type="approve" class="w-8 h-8 mr-1" @click="acceptFriend(user.id)">+</Button>
            <Button type="danger" class="w-8 h-8" @click="rejectFriend(user.id)">-</Button>
          </template>
        </UserCard>

        <UserCard
          v-if="friends?.length != 0"
          v-for="user in friends"

          :username="user.username"
          :role="user.role"
          :status="user.status"
          :is-online="!!user.isOnline"
        >
          <template #actions>
            <Button @click="removeFriend(user.id)" type="danger" class="w-8 h-8">
              <TrashcanIcon/>
            </Button>
          </template>
        </UserCard>
      </div>

      <Text v-if="friends?.length === 0 && friendsRequests?.length === 0" align="center" size="sm">
        Кажется, здесь никого нет...
      </Text>

      <Card
        class="sticky bottom-0 z-10 border-t p-3 mx-auto w-fit"
        type="glass"
      >
        <div class="flex justify-center items-center gap-2.5">
          <Input v-model="username" class="h-6" placeholder="Никнейм" color="glass" size="sm" weight="semibold"/>
          <Button @click="addFriend" class="w-6 h-6" type="accent">н</Button>
        </div>
      </Card>
    </div>
  </Card>
</template>