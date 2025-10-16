<script lang="ts" setup>
import { Button, Card, Heading, Text } from '@repo/ui';

const props = defineProps({
  title: String,
  description: String,
  date: String
});
</script>

<template>
  <Card
    type="dark"
    class="min-w-80 p-4"
  >
    <div class="flex items-center justify-between w-full mb-2">
      <Heading :level="3" class="text-lg font-semibold">
        {{ props.title }}
      </Heading>

      <div class="flex items-center gap-2">
        <Heading color="dark" :level="4" class="text-sm">
          {{ props.date }}
        </Heading>
      </div>
    </div>

    <Text size="sm" color="secondary" class="whitespace-pre-line break-words mb-3">
      {{ props.description }}
    </Text>

    <Button class="w-full">
      Открыть
    </Button>
  </Card>
</template>
