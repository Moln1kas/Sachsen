<script setup lang="ts">
import { Card, OnlineStatus, Text } from '@repo/ui';
import { useServerStore } from '../../stores/server.store';
import { onMounted, ref } from 'vue';
import { getMinecraftServerStatus } from '../../api/minecraft.api';
import ServerStatus from '../../types/server-status.type';

const serverStore = useServerStore();
const status = ref<ServerStatus>();

const fetchStatus = async () => {
  if(!serverStore.server) return;
  status.value = await getMinecraftServerStatus(serverStore.server.serverAddress);
}

onMounted(async () => {
  fetchStatus();

  setInterval(fetchStatus, 300000)
})
</script>

<template>
  <Card v-if="serverStore.server">
    <div class="flex justify-between">
        <Text size="sm" weight="semibold">
          {{ serverStore.server.name }} - 
          <OnlineStatus :is-online="status?.online"/>
        </Text>
        <Text size="sm" color="dark" weight="semibold">
          {{ serverStore.server.serverAddress }}
        </Text>
        <Text size="sm" color="dark" weight="semibold">
          {{ serverStore.server.minecraftVersion }}
        </Text>
        <Text size="sm" weight="semibold">
            {{ status?.players.online || 0 }} / {{ status?.players.max || 0 }}
        </Text>
    </div>
  </Card>
</template>