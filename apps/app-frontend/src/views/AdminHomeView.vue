<script lang="ts" setup>
import { Card, Heading } from '@repo/ui';
import { useUserStore } from '../stores/user.store';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <div class="flex gap-2 w-full h-full">
    <RouterView v-if="route.path !== '/admin'"/>
    <Card class="w-full" v-else>
      <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
        Добро пожаловать, {{ userStore.user.username }}
      </Heading>
    </Card>
  </div>

</template>