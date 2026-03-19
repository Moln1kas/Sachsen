<script setup lang="ts">
import { computed } from 'vue'
import Text from './Text.vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const itemClasses = computed(() => {
  return [
    props.active ? 'bg-accent/40' : 'hover:bg-bg/40 bg-bgPrimary/40'
  ]
})
</script>

<template>
  <div
    class="group backdrop-blur-sm flex items-center justify-between gap-2.5 px-2.5 py-2 cursor-pointer transition"
    :class="itemClasses"
  >
    <Text size="sm" weight="semibold" class="select-none">{{ text }}</Text>
    
    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <slot name="actions" />
    </div>
  </div>
</template>