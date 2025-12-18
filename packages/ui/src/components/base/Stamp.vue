<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'fg'
  }
})

type StampColor = 'blue' | 'red' | 'green' | 'purple';

const stampClasses = computed(() => {
  const colorMap: Record<StampColor, string> = {
    blue: 'text-fg',
    red: 'text-error',
    green: 'text-success',
    purple: 'text-purple'
  }

  return [
    colorMap[props.color as StampColor],
  ]
});
</script>

<template>
  <div
    class="flex justify-center px-2 py-1 border-[3px] rotate-[-3deg] font-extrabold text-lg font-display uppercase select-none"
    :class="stampClasses"
  >
    {{ text }}
  </div>
</template>