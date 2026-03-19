<script lang="ts" setup>
import { Card, Input, Textarea, Button, Heading, Checkbox, Text, DropdownList, DropdownItem } from '@repo/ui';
import { formatLocalDate } from '@repo/utils';
import { computed, onMounted, ref } from 'vue';
import { getBlogsCategories } from '../api/blogs.api';
import BlogCard from '../components/ui/BlogCard.vue';
import Category from '../types/blog-category.type';
import { alertDialog, confirmDialog, promptDialog } from '../core/dialog/dialog';
import { createBlog } from '../api/admin/blogs/blogs.api';
import { createBlogCategory, deleteBlogCategory } from '../api/admin/blogs/blogs-categories.api';
import { AddIcon, TrashcanIcon } from '@repo/assets';

// блог
const title = ref<string>('');
const content = ref<string>('');
const isImportant = ref<boolean>(false);

// категори
const categories = ref<Category[]>([]);
const selectedCategoryId = ref<number | null>(null);

onMounted(async () => {
  await updateCategories();
});

const blogCategoryName = computed(() => {
  const id = Number(selectedCategoryId.value);
  const category = categories.value.find(cat => cat.id === id);
  return category ? category.title : 'Без категории';
});

const updateCategories = async () => {
  categories.value = await getBlogsCategories();
}

const postBlog = async () => {
  if(!title.value || !content.value) return;

  try {
    await createBlog(
      title.value, 
      content.value, 
      Math.abs(
        Number(selectedCategoryId.value)
      ), 
      isImportant.value
    );

    alertDialog('Блог создан', `Вы успешно создали новую запись в блог. Пост автоматически появится у всех пользователей.`);
  } catch(err) {
    alertDialog('Блог НЕ создан', `${err}`);
  }
}

const createNewCategory = async () => {
  const categoryTitle = await promptDialog(
    'Создание категории', 
    'Введите название новой категории блога:',
    'Категория',
    { width: 300, height: 200 }
  );
  if(!categoryTitle) return;

  try {
    await createBlogCategory(
      categoryTitle,
    );
    await updateCategories();
    alertDialog('Категория создана', `Вы успешно создали новую категорию. Вы сможете использовать ее при написании блогов.`);
  } catch(err) {
    alertDialog('Категория НЕ создана', `${err}`);
  }
}

const removeCategory = async (id: number, title: string) => {
  const confirmed = await confirmDialog(
    'Удаление категории',
    `Вы уверены, что хотите удалить категорию "${title}"? Действие необратимо и все блоги в этой категории останутся без категории.`
  );

  if (!confirmed) return;

  try {
    await deleteBlogCategory(id);
    
    if (selectedCategoryId.value === id) {
      selectedCategoryId.value = null;
    }
    
    await updateCategories();
    alertDialog('Успех', 'Категория успешно удалена');
  } catch (err) {
    alertDialog('Ошибка удаления', `${err}`);
  }
};
</script>

<template>
  <div class="flex flex-col w-full gap-2 h-full overflow-auto">
    <Card class="flex flex-col gap-2">
      <div class="flex w-full justify-between items-center">
        <Heading class="w-2/3" align="center" color="dark" :level="3">Докладывай всё</Heading>
      </div>

      <div class="flex w-full gap-2.5">
        <div class="flex flex-col w-2/3 gap-1">
          <Input color="dark" required placeholder="Заголовок" v-model="title" class="w-full"/>
          <Textarea color="dark" required placeholder="Содержимое" v-model="content" class="h-32 min-h-30"/>
        </div>

        <div class="flex flex-col w-1/3 gap-2.5">
          <div class="flex flex-col w-full gap-1">
            <Text size="sm" weight="semibold" color="secondary">Категория:</Text>
            <div class="flex w-full gap-1">
              <DropdownList class="w-full" :label="categories.find(c => c.id === selectedCategoryId)?.title || 'Выберите категорию'">
                <DropdownItem 
                  v-for="cat in categories" 
                  :key="cat.id" 
                  :text="cat.title"
                  :active="selectedCategoryId === cat.id"
                  @click="selectedCategoryId = cat.id"
                >
                  <template #actions>
                    <Button 
                      type="danger" 
                      class="w-6 h-6" 
                      @click.stop="removeCategory(cat.id, cat.title)"
                    >
                      <TrashcanIcon class="fill-fgPrimary" />
                    </Button>
                  </template>
                </DropdownItem>
              </DropdownList>

              <Button 
                type="approve"
                class="w-10 h-full"
                @click="createNewCategory"
              >
                <AddIcon class="fill-fgPrimary" />
              </Button>
            </div>
          </div>

          <Checkbox label="Это важно?" v-model="isImportant"/>
          
          <div class="mt-auto">
            <Button class="w-full" type="approve" @click="postBlog">Опубликовать</Button>
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <BlogCard
        :title="title || 'Заголовок'"
        :description="content || 'Содержимое'"
        :category="blogCategoryName"
        :date="formatLocalDate()"
        :is-important="isImportant"
        :is-first="true"
      />
    </Card>
  </div>

</template>