<script lang="ts" setup>
  import { Input, Card, Heading, Button } from '@repo/ui';
  import { onMounted, ref } from 'vue';
  import User from '../types/user.type';
  import { findUserByUsername, getUserStatus } from '../api/user.api';
  import UserCard from '../components/ui/UserCard.vue';
  import { acceptFriendRequest, createFriendRequest, getUserFriends, getUserFriendsRequests, rejectFriendRequest, removeUserFromFriends } from '../api/friends.api';
  import { useUserStore } from '../stores/user.store';

  const userStore = useUserStore();

  const friendsRequests = ref<User[]>();

  const friends = ref<User[]>();
  const friendsStatuses = ref<Record<number, boolean>>({}); // Мне не нравится. Потом мб как-то улучшу.

  const username = ref<string>('');
  const user = ref<User>();
  const userStatus = ref<boolean>();

  onMounted(async () => {
    await updateData();
  });

  const updateData = async () => {
    friendsRequests.value = await getUserFriendsRequests();
    friends.value = await getUserFriends(userStore.user.id);

    for (const user of [...(friendsRequests.value || []), ...(friends.value || [])]) {
      friendsStatuses.value[user.id] = await getUserStatus(user.id);
    }
  }

  const findUser = async () => {
    console.log(username.value)
    try {
      user.value = await findUserByUsername(username.value);
      userStatus.value = await getUserStatus(user.value.id);
    } catch (err: any) {
      alert(err);
    }
  }

  const addFriend = async () => {
    if(!user.value) return;
    try {
      await createFriendRequest(user.value.id);
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
  <Card class="mb-2">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Поиск игроков
    </Heading>

    <div class="flex">
      <Input class="mr-1" v-model="username" placeholder="Никнейм пользователя"/>
      <Button @click="findUser">Найти</Button>
    </div>

    <div class="flex mt-2" v-if="user && userStatus !== undefined">
      <UserCard
        :username="user.username"
        :role="user.role"
        :status="user.status"
        :is-active="!!userStatus"
      >
        <template #actions>
          <Button type="approve" class="w-12" @click="addFriend">+</Button>
        </template>
      </UserCard>
    </div>
  </Card>

  <Card class="mb-2" v-if="friendsRequests?.length != 0">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Заявки в друзья
    </Heading>

    <div class="flex flex-col gap-2.5">
      <UserCard
        v-for="user in friendsRequests"

        :key="user.id"
        :username="user.username"
        :role="user.role"
        :status="user.status"
        :is-active="!!friendsStatuses[user.id]"

        class="mr-1"
      >
        <template #actions>
          <Button type="approve" class="w-12 mr-1" @click="acceptFriend(user.id)">Да</Button>
          <Button type="danger" class="w-12" @click="rejectFriend(user.id)">Нет</Button>
        </template>
      </UserCard>
    </div>
  </Card>

  <Card v-if="friends?.length != 0">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Ваши друзья
    </Heading>

    <div class="flex flex-col gap-2.5">
      <UserCard
        v-for="user in friends"

        :username="user.username"
        :role="user.role"
        :status="user.status"
        :is-active="!!friendsStatuses[user.id]"
      >
        <template #actions>
          <Button @click="removeFriend(user.id)" type="danger" class="w-12 h-full"> - </Button>
        </template>
      </UserCard>
    </div>
  </Card>
</template>