<script lang="ts" setup>
import { Card, Input, Textarea, Button, Heading, Checkbox } from '@repo/ui';
import { ref } from 'vue';
import { createBlog } from '../api/blogs.api';
import BlogCard from '../components/ui/BlogCard.vue';

const title = ref<string>('');
const content = ref<string>('');
const categoryId = ref<string>('');
const isImportant = ref<boolean>(false);

const postBlog = async () => {
  if(!title.value || !content.value || !categoryId.value) return;

  try {
    await createBlog(
      title.value, 
      content.value, 
      Math.abs(
        Number(categoryId.value)
      ), 
      isImportant.value
    );

    alert('Блог успешно создан!')
  } catch(err) {
    alert(err);
  }
}

</script>

<template>
  <div class="flex w-full gap-2 h-full">
    <Card class="w-1/2">
      <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
        Выкладывай как есть
      </Heading>

      <form class="flex flex-col gap-2">
        <div class="flex flex-col gap-0.5">
          <Input required placeholder="Заголовок" v-model="title"/>
          <Textarea required placeholder="Содержимое" v-model="content"/>
          <Input required placeholder="ID категории" type="number" min="1" v-model="categoryId"/>
        </div>

        <Checkbox label="Это важно?" v-model="isImportant"/>

        <Button class="w-full" @click="postBlog">Поделиться</Button>
      </form>

    </Card>

    <Card class="w-1/2">
      <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
        Превью
      </Heading>
      <BlogCard
        :title="title || 'Заголовок'"
        :description="content || 'Содержимое'"
        :category="''"
        :date="new Date().toLocaleString()"
        :is-important="isImportant"
        :is-first="true"
      />
    </Card>
  </div>

</template>