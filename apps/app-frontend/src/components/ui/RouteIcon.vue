<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  location: {
    type: String,
    required: true
  }
});

const isActive = (path: string) => route.path === path;
</script>

<template>
  <div
    class="w-8 h-8 flex items-center justify-center transition cursor-pointer"
    :class="isActive(props.location) 
      ? 'scale-120' 
      : 'scale-100'"
    @click="router.push(props.location)"
  >
    <slot/>
  </div>
</template>