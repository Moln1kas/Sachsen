<script setup lang="ts">
import {  
  Card, 
  Heading,
  Text,
  Button
} from '@repo/ui';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { onMounted, ref } from 'vue';

const props = defineProps({
  title: String,
  message: String
});

const appWindow = getCurrentWindow();
const close = () => appWindow.close();

const okButtonRef = ref<HTMLElement | null>(null);

onMounted(() => {
  okButtonRef.value?.focus();
});
</script>

<template>
  <Card 
    class="h-full flex flex-col gap-2"
  >
    <Heading align="center" color="dark" :level="3" class="shrink-0">
      {{ props.title }}
    </Heading>

    <Card type="dark" class="h-full overflow-auto">
      <Text color="secondary" size="sm" class="whitespace-pre-wrap break-words">
        {{ props.message }}
      </Text>
    </Card>
    <div class="flex justify-end gap-0.5">
      <Button
        ref="okButtonRef"
        @click="close"
        class="w-16 h-8"
      >
        Ок
      </Button>
    </div>
  </Card>
</template>
