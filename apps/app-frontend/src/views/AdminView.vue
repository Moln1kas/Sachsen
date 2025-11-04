<script lang="ts" setup>
import { Input, Button } from '@repo/ui';
import { ref } from 'vue';
import { createBlog } from '../api/blogs.api';

const title = ref<string>();
const content = ref<string>();

const postBlog = async () => {
  if(!title.value || !content.value) return;
  await createBlog(title.value, content.value);
}
</script>

<template>
  <Input placeholder="Заголовок" v-model="title"/>
  <Input placeholder="Содержимое" v-model="content"/>
  <Button @click="postBlog">Поделиться</Button>
</template>