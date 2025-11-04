<script lang="ts" setup>
  import { HumanAdminIcon, HumanIcon } from '@repo/assets';
import { Card, Text } from '@repo/ui';

  const props = defineProps({
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  });
</script>

<template>
  <Card type="dark" class="w-full flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8">
        <HumanIcon v-if="role === 'PLAYER'" />
        <HumanAdminIcon v-else />
      </div>
      <Text size="lg" weight="semibold">{{ username }}</Text>
    </div>

    <div class="flex items-center space-x-4">
      <Text size="lg" weight="semibold">
        <span v-if="isActive" class="text-success">В СЕТИ</span>
        <span v-else class="text-error">НЕ В СЕТИ</span>
      </Text>

      <div class="flex" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </Card>
</template>
