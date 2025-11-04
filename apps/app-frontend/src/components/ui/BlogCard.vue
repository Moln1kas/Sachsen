<script lang="ts" setup>
import { Card, Heading, Text } from '@repo/ui';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    requred: true
  },
  category: {
    type: String,
    required: true
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <Card
    type="dark"
    class="min-w-80 p-4 flex flex-col hover:border-fgPrimary"
    :class="[
      isImportant && isFirst ? 'border-purple border-2' :
      isImportant ? 'border-success border-2' :
      isFirst ? 'border-error border-2' : ''
    ]"
  >
    <div class="w-full flex justify-between items-center mb-4">
      <Heading :level="3" weight="bold">
        {{ props.title }}
      </Heading>

    <Heading
      v-if="isImportant && isFirst"
      :level="3"
      align="right"
      weight="bold"
      color="purple"
    >
      СЕНСАЦИОННАЯ НОВИНКА!
    </Heading>
    <Heading
      v-else-if="isImportant"
      :level="3"
      align="right"
      weight="bold"
      color="green"
    >
      СЕНСАЦИЯ!
    </Heading>
    <Heading
      v-else-if="isFirst"
      :level="3"
      align="right"
      weight="bold"
      color="red"
    >
      НОВИНКА!
    </Heading>
    </div>

    <Text size="sm" color="secondary" class="whitespace-pre-line break-words flex-1 overflow-y-auto mb-4">
      {{ props.description }}
    </Text>

    <div class="w-full flex justify-between">
      <Text size="sm" color="dark">
        {{ props.date }}
      </Text>

      <Text size="sm" weight="semibold" color="dark">
        {{ props.category }}
      </Text>
    </div>
  </Card>
</template>
