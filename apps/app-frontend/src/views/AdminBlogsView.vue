<script lang="ts" setup>
import { Card, Input, Textarea, Button, Heading, Checkbox, Text } from '@repo/ui';
import { computed, onMounted, ref } from 'vue';
import { getBlogsCategories } from '../api/blogs.api';
import BlogCard from '../components/ui/BlogCard.vue';
import Category from '../types/blog-category.type';
import { alertDialog } from '../core/dialog/dialog';
import { createBlog } from '../api/admin/blogs/blogs.api';
import { createBlogCategory } from '../api/admin/blogs/blogs-categories.api';

// блог
const title = ref<string>('');
const content = ref<string>('');
const categoryId = ref<string>('');
const isImportant = ref<boolean>(false);

// категори
const categories = ref<Category[]>([]);
const categoryTitle = ref<string>();

onMounted(async () => {
  await updateCategories();
});

const blogCategoryName = computed(() => {
  const id = Number(categoryId.value);
  const category = categories.value.find(cat => cat.id === id);
  return category ? category.title : 'Без категории';
});

const updateCategories = async () => {
  categories.value = await getBlogsCategories();
}

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

    alertDialog('Блог создан', `Вы успешно создали новую запись в блог. Пост автоматически появится у всех пользователей.`);
  } catch(err) {
    alertDialog('Блог НЕ создан', `${err}`);
  }
}

const createCategory = async () => {
  if(!categoryTitle.value) return;

  try {
    await createBlogCategory(
      categoryTitle.value,
    );
    await updateCategories();
    alertDialog('Категория создана', `Вы успешно создали новую категорию. Вы сможете использовать ее при написании блогов.`);
  } catch(err) {
    alertDialog('Категория НЕ создана', `${err}`);
  }
}

</script>

<template>
  <div class="flex w-full gap-2 h-full">
    <div class="flex flex-col gap-2 w-1/2">
      <Card class="flex flex-col gap-2">
        <Heading align="center" color="dark" :level="3" class="shrink-0">
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

      <Card class="flex flex-col gap-2">
        <Heading align="center" color="dark" :level="3" class="shrink-0">
          Категории
        </Heading>

        <div class="gap-1 max-h-10 overflow-y-scroll">
          <div class="flex w-full pe-4" v-for="category in categories">
            <Text class="w-full">{{ category.title }}</Text>
            <Text>{{ category.id }}</Text>
          </div>
        </div>


        <form class="flex flex-col gap-2">
          <div class="flex flex-col gap-0.5">
            <Input required placeholder="Заголовок" v-model="categoryTitle"/>
          </div>

          <Button class="w-full" @click="createCategory">Создать</Button>
        </form>
      </Card>
    </div>

    <Card class="w-1/2 h-fit">
      <Heading align="center" color="dark" :level="3" class="shrink-0 mb-2">
        Превью
      </Heading>
      <BlogCard
        :title="title || 'Заголовок'"
        :description="content || 'Содержимое'"
        :category="blogCategoryName"
        :date="new Date().toLocaleString()"
        :is-important="isImportant"
        :is-first="true"
      />
    </Card>
  </div>

</template>