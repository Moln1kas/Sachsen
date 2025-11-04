<script setup lang="ts">
import { Card, Text } from '@repo/ui';
import { useServerStore } from '../../stores/server.store';
import { onMounted, ref } from 'vue';
import { getMinecraftServerStatus } from '../../api/minecraft.api';
import ServerStatus from '../../types/server-status.type';

const serverStore = useServerStore();
const status = ref<ServerStatus>();

const fetchStatus = async () => {
  status.value = await getMinecraftServerStatus(serverStore.server.serverAddress);
}

onMounted(async () => {
  fetchStatus();

  setInterval(fetchStatus, 300000)
})
</script>

<template>
  <Card>
    <div class="flex justify-between">
        <Text size="sm" weight="semibold">
          {{ serverStore.server.name }} - 
          <span v-if="status?.online === true" class="text-success">ОНЛАЙН</span>
          <span v-else class="text-error">ОФФЛАЙН</span>
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