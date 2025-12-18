<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
})

type CardType = 'default' | 'dark' | 'glass';

const cardClasses = computed(() => {
	const typeMap: Record<CardType, string[]> = {
		default: ['bg-bg', 'text-fgPrimary'],
		dark: ['bg-bgPrimary', 'text-fgPrimary'],
    glass: ['bg-bgPrimary/40', 'backdrop-blur-sm', 'text-fgPrimary']
	}

  return [
    typeMap[props.type as CardType],
  ]
});
</script>

<template>
	<div
    class="p-2.5 border border-black transition"
    :class="cardClasses"
  >
    <slot/>
	</div>
</template>