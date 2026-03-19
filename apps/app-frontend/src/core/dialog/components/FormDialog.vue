<script setup lang="ts" generic="T = Record<string, any>">
import { 
  Button, 
  Card, 
  Heading,
  Input,
  Text
} from '@repo/ui';
import { ref } from 'vue';
import { FormDialogField } from '../types';
import { ApplyIcon, ShrimpsBg } from '@repo/assets';

const props = defineProps({
  title: String,
  message: String,
  fields: Array as () => FormDialogField[]
})

const data = ref<T>({} as T);

const emit = defineEmits<{
  (e: 'close', result: T): void;
}>();
</script>

<template>
  <Card class="h-full flex flex-col gap-2" :style="{ backgroundImage: `url(${ShrimpsBg})` }">
    <Card type="glass" class="h-full flex flex-col gap-2.5 overflow-auto">
      <Heading align="center" color="" :level="3" class="shrink-0">
        {{ props.title }}
      </Heading>

      <Text size="sm" class="whitespace-pre-wrap wrap-break-word">
        {{ props.message }}
      </Text>

      <Card type="glass">
        <form class="flex flex-col gap-2.5"">
          <div class="flex flex-col gap-1">
            <Input
              v-for="f in fields"
              :placeholder="f.placeholder"
              v-model="data[f.key]"
              class="w-full"
              color="glass"
            />
          </div>

          <Button type="accent" @click="emit('close', data as T)" class="w-full h-8">
            <ApplyIcon class="fill-fgPrimary"/>
          </Button>
        </form>
      </Card>
    </Card>
  </Card>
</template>
