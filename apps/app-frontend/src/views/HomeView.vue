<script setup lang="ts">
import { Card, Heading } from '@repo/ui';
import BlogCard from '../components/ui/BlogCard.vue';
</script>

<template>
  <Card class="flex flex-col h-full min-h-0 overflow-hidden">
    <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
      Последние события
    </Heading>

    <div
      class="flex-1 min-h-0 overflow-y-auto grid gap-2.5
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <BlogCard
        v-for="i in 3"
        :key="i"
        title="Заголовок"
        :description="'о великий саксен '.repeat(i)"
        date="06.15.25"
      />
    </div>
  </Card>
</template>
