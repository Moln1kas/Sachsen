<script setup lang="ts">
import { Card, Heading } from '@repo/ui';
import BlogCard from '../components/ui/BlogCard.vue';
</script>

<template>
  <Card class="mb-2">
    <Heading class="mb-2" align="center" color="dark" :level="3">Последние события</Heading>
    <div class="flex overflow-x-scroll">
      <BlogCard 
      title="Заголовок"
      description="Описание"
      date="06.15.25"
      class="mr-2"
      v-for="_ in 8"
      />
    </div>
  </Card>
</template>