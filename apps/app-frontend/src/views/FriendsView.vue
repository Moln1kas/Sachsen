<script lang="ts" setup>
  import { Input, Card, Heading, Button, Text } from '@repo/ui';
  import { onMounted, ref } from 'vue';
  import User from '../types/user.type';
  import { findUserByUsername } from '../api/user.api';
  import UserCard from '../components/ui/UserCard.vue';
  import { acceptFriendRequest, createFriendRequest, getUserFriends, getUserFriendsRequests, rejectFriendRequest, removeUserFromFriends } from '../api/friends.api';
  import { useUserStore } from '../stores/user.store';
  import { AddIcon, ApplyIcon, CrossIcon, SearchIcon, TrashcanIcon } from '@repo/assets';
  import { alertDialog, confirmDialog } from '../core/dialog/dialog';

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
    try {
      const user = await findUserByUsername(username.value);

      const confirm = await confirmDialog('Добавить друга?', `${user.username} появится в вашем списке друзей только после того, как он одобрит вашу заявку.`);
      if(!confirm) return;

      await createFriendRequest(user.id);
      alertDialog('Заявка отправлена', 'Он появится в вашем списке друзей только после того как примет вашу заявку.')
    } catch (err: any) {
      alertDialog('Заявка НЕ отправлена', err)
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
    const confirm = await confirmDialog('Удалить друга?', `Он будет удален из вашего списка друзей. Вы сможете заново отправить ему заявку.`);
    if(!confirm) return;
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
      <div class="flex flex-col gap-1">
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
            <Button type="approve" class="w-8 h-8 mr-1" @click="acceptFriend(user.id)">
              <ApplyIcon class="fill-fgPrimary"/>
            </Button>
            <Button type="danger" class="w-8 h-8" @click="rejectFriend(user.id)">
              <CrossIcon class="fill-fgPrimary"/>
            </Button>
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
              <TrashcanIcon class="fill-fgPrimary"/>
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
          <Text size="sm" color="secondary" weight="semibold">Добавьте друга!</Text>
          <Input v-model="username" class="h-8" placeholder="Никнейм друга" color="glass" size="sm" weight="semibold"/>
          <Button @click="addFriend" class="w-8 h-8" type="accent">
            <SearchIcon class="fill-fgPrimary"/>
          </Button>
        </div>
      </Card>
    </div>
  </Card>
</template>