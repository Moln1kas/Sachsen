<script lang="ts" setup>
import YoomoneyCard from '../components/ui/YoomoneyCard.vue';
import { ShrimpsBg } from '@repo/assets';
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center shadow-[inset_0_0_0_1px_black] bg-cover bg-center"
    :style="{ backgroundImage: `url(${ShrimpsBg})` }"
  >
    <YoomoneyCard />
  </div>
</template>
