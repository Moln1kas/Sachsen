<script setup lang="ts">
import { 
  Card, 
  Heading,
  Text
} from '@repo/ui';
import { listen, emit } from '@tauri-apps/api/event';
import { onMounted, ref } from 'vue';

const title = ref<string>('');
const message = ref<string>('');

onMounted(() => {
  listen('dialog-data', (event) => {
    const payload = event.payload as { title: string; message: string };
    title.value = payload.title;
    message.value = payload.message;
  });

  emit('dialog-ready');
});
</script>

<template>
  <Card class="h-full flex flex-col">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      {{ title }}
    </Heading>

    <Card type="dark" class="h-full mb-2.5 overflow-auto">
      <Text color="secondary" size="sm" class="whitespace-pre-wrap break-words">
        {{ message }}
      </Text>
    </Card>
  </Card>
</template>
