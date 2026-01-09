<script setup lang="ts">
import { 
  Button, 
  Card, 
  Heading,
  Input,
  Text
} from '@repo/ui';
import { onMounted, ref } from 'vue';

const props = defineProps({
  title: String,
  message: String,
  placeholder: String
})

const username = ref<string>('');

const emit = defineEmits<{
  (e: 'close', result: string): void;
}>();

const promptInputRef = ref<{ focus: () => void } | null>(null);

onMounted(() => {
  promptInputRef.value?.focus();
});
</script>

<template>
  <Card class="h-full flex flex-col gap-2">
    <Heading align="center" color="dark" :level="3" class="shrink-0">
      {{ props.title }}
    </Heading>

    <Card type="dark" class="h-full overflow-auto">
      <Text color="secondary" size="sm" class="whitespace-pre-wrap break-words">
        {{ props.message }}
      </Text>
    </Card>

    <form class="flex gap-0.5" @submit.prevent="emit('close', username)">
      <Input ref="promptInputRef" :placeholder="placeholder" v-model="username" class="w-full h-8"/>
      <Button @click="emit('close', username)" class="w-18 h-8">
        Ок
      </Button>
    </form>
  </Card>
</template>
