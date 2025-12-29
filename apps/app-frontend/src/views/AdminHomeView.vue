<script lang="ts" setup>
import { Button, Card, Heading } from '@repo/ui';
import { useUserStore } from '../stores/user.store';
import RouteIcon from '../components/ui/RouteIcon.vue';
import { AdminIcon, BlogIcon } from '@repo/assets';
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

    <Card class="flex flex-col gap-1">
      <RouteIcon location="/admin">
        <AdminIcon/>
      </RouteIcon>
      <RouteIcon location="/admin/blogs">
        <BlogIcon/>
      </RouteIcon>
    </Card>
  </div>

</template>