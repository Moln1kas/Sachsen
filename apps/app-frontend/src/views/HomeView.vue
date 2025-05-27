<script setup lang="ts">
import { Card, Text } from '@repo/ui';
import Yoomoney from '@/components/ui/YoomoneyCard.vue';
import ServerCard from '../components/ui/ServerCard.vue';
</script>

<template>
  <Card>
    <div class="flex mb-2">
      <Yoomoney class="mr-2"/>
      <Text>
        Ого, да это же Саксен!
      </Text>
    </div>

    <div class="flex">
      <ServerCard v-for="_ in 3" class="mr-1"/>
    </div>
  </Card>
</template>