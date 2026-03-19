<script lang="ts" setup>
import { ref, shallowRef, watch, onMounted } from 'vue';
import { SteaveSkin } from '@repo/assets';

const props = defineProps<{ skinUrl?: string }>();

const defaultAvatarRendered = shallowRef<string>('');
const avatar = ref<string>('');

const renderHead = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 8;
      canvas.height = 8;
      const ctx = canvas.getContext('2d')!;
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 8, 8, 8, 8, 0, 0, 8, 8);
      ctx.drawImage(img, 40, 8, 8, 8, 0, 0, 8, 8);
      
      resolve(canvas.toDataURL());
    };
    img.onerror = (e) => reject(e);
  });
};

const initDefault = async () => {
  if (!defaultAvatarRendered.value) {
    defaultAvatarRendered.value = await renderHead(SteaveSkin);
  }
  if (!avatar.value) avatar.value = defaultAvatarRendered.value;
};

watch(() => props.skinUrl, async (newUrl, _, onCleanup) => {
  let isCancelled = false;
  onCleanup(() => { isCancelled = true; });

  if (!newUrl) {
    await initDefault();
    if (!isCancelled) avatar.value = defaultAvatarRendered.value;
    return;
  }

  try {
    const rendered = await renderHead(newUrl);
    if (!isCancelled) avatar.value = rendered;
  } catch (e) {
    await initDefault();
    if (!isCancelled) avatar.value = defaultAvatarRendered.value;
  }
}, { immediate: true });
</script>

<template>
  <div class="overflow-hidden border-black border-1">
    <img 
      v-if="avatar"
      :src="avatar" 
      class="image-pixelated w-full h-full"
    />
  </div>
</template>

<style scoped>
.image-pixelated {
  image-rendering: pixelated;
}
</style>