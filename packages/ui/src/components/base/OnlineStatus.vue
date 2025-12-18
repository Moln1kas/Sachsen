<script lang="ts" setup>
const props = defineProps({
  isOnline: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <span v-if="props.isOnline" class="text-success text-shadow-[0_0_16px]">ОНЛАЙН</span>
  <span v-else class="text-error text-shadow-[0_0_16px]">ОФЛАЙН</span>
</template>