<script setup lang="ts">
import { ApplyIcon, CrossIcon } from '@repo/assets';
import { 
  Button, 
  Card, 
  Heading,
  Text
} from '@repo/ui';
import { onMounted, ref } from 'vue';

const props = defineProps({
  title: String,
  message: String
})

const emit = defineEmits<{
  (e: 'close', result: boolean): void;
}>();

const noButtonRef = ref<{ focus: () => void } | null>(null);

onMounted(() => {
  noButtonRef.value?.focus();
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

    <div class="flex justify-end gap-0.5">
      <Button type="approve" @click="emit('close', true)" class="w-16 h-8">
         <ApplyIcon class="fill-fgPrimary"/> Да
      </Button>
      <Button ref="noButtonRef" @click="emit('close', false)" class="w-16 h-8">
        <CrossIcon/> Нет
      </Button>
    </div>
  </Card>
</template>
