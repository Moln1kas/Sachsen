<script lang="ts" setup>
import { Card, OnlineStatus, UserStatusStamp, Text, PlayerHead } from '@repo/ui';
import { ref, watch } from 'vue';
import { getUserSkin } from '../../api/skins.api';

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
  },
  skinHash: {
    type: String,
    required: false,
  },
});

const userSkinUrl = ref<string>(''); 

watch(() => props.skinHash, async (newHash) => {
  if (!newHash) {
    userSkinUrl.value = '';
    return;
  }
  
  try {
    const url = await getUserSkin(newHash);
    userSkinUrl.value = url;
  } catch (e) {
    userSkinUrl.value = '';
  }
}, { immediate: true });

</script>

<template>
  <Card type="dark" class="w-full flex flex-col gap-5">
    <div class="w-full flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8">
          <PlayerHead :skin-url="userSkinUrl"/>
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
    </div>

    <div v-if="$slots.description">
      <slot name="description"></slot>
    </div>
  </Card>
</template>
