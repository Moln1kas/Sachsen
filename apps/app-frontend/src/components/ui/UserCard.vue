<script lang="ts" setup>
  import { HumanAdminIcon, HumanIcon } from '@repo/assets';
  import { Card, OnlineStatus, UserStatusStamp, Text } from '@repo/ui';

  const props = defineProps({
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
    }
  });
</script>

<template>
  <Card type="dark" class="w-full flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8">
        <HumanIcon v-if="props.role === 'PLAYER'" />
        <HumanAdminIcon v-else />
      </div>
      <Text size="lg" weight="semibold">
        <OnlineStatus :is-online="props.isOnline"/>
      </Text>
      <Text size="lg" weight="semibold" class="w-43 max-w-43 overflow-x-hidden">{{ props.username }}</Text>
      <UserStatusStamp :status="props.status"/>
    </div>

    <div class="flex items-center space-x-4">
      <div class="flex" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </Card>
</template>
