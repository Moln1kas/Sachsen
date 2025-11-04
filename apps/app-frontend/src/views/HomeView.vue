<script setup lang="ts">
import { Card, Heading, Text, Button } from '@repo/ui';
import BlogCard from '../components/ui/BlogCard.vue';
import { computed, onMounted, ref } from 'vue';
import { getBlogs } from '../api/blogs.api';
import Blog from '../types/blog.type';
import { useSocketStore } from '../stores/socket.store';

const socketStore = useSocketStore();

const blogsData = ref<Blog>();
const currentPage = ref<number>(1);

const maxPages = computed(() => {
  if(!blogsData.value) return 1;

  const res = Math.ceil(
      blogsData.value.total / blogsData.value.limit
    );
  return res>0 ? res : 1;
});

const latestBlog = computed(() => {
  if(!blogsData.value) return;
  if(blogsData.value.page !== 1) return;

  return blogsData.value.blogs[0].id;
});

onMounted(async () => {
  await updateBlogs();

  console.log(blogsData.value?.blogs[0].category)

  socketStore.socket.on('blogs:update', async (blog) => {
    if(!blogsData.value) return;
    if(blogsData.value.page !== 1) return;

    blogsData.value.blogs.unshift(blog);
    blogsData.value.blogs.pop();
    blogsData.value.total++;
  });
});

const previousPage = async () => {
  if(currentPage.value <= 1) return;

  currentPage.value--;

  await updateBlogs();
}

const nextPage = async () => {
  if(!maxPages.value) return;
  if(currentPage.value >= maxPages.value) return;
  
  currentPage.value++;

  await updateBlogs();
}

const updateBlogs = async () => {
  blogsData.value = await getBlogs(currentPage.value);
}

const transformDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
}
</script>

<template>
  <Card class="flex flex-col h-full min-h-0 overflow-hidden">
    <div class="flex justify-center items-center gap-5 mb-2">
      <Button class="w-12" @click="previousPage()"><</Button>
      <Heading color="dark" :level="3" class="shrink-0">
        Последние события
        (
        <span class="text-success" v-if="blogsData">
          {{ blogsData.page }} / {{ maxPages }}
        </span>
        )
      </Heading>
      <Button class="w-12" @click="nextPage()">></Button>
    </div>


    <div
      class="flex-1 min-h-0 overflow-y-auto grid gap-2.5
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      v-if="blogsData && blogsData.total > 0"
    >
      <BlogCard
        v-for="blog in blogsData.blogs"
        :title="blog.title"
        :description="blog.text"
        :date="transformDate(blog.updatedAt)"
        :category="blog.category.title"

        :is-first="blog.id === latestBlog"
        :is-important="blog.isImportant"
      />
    </div>
    <Text align="center" v-else>Кажется у нас нет для вас новостей...</Text>
  </Card>
</template>
