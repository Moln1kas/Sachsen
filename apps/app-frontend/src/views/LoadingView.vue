<script setup lang="ts">
import { Spinner, Text } from '@repo/ui';
import { useAppStore } from '../stores/app.store';

const app = useAppStore()
</script>


<template>
  <div class="w-full h-full flex items-center justify-center">
    <Text v-if="app.error" weight="bold" align="center" class="max-w-1/2">
      {{ app.error }}
    </Text>
    <Spinner class="w-16 h-16" v-else>Загрузка...</Spinner>
  </div>
</template>