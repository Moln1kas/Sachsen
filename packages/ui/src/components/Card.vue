<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
})

type CardType = 'default' | 'dark';

const cardClasses = computed(() => {
  const baseClasses = [
    'p-2.5',
    'border',
    'border-black',
    'transition',
  ];

	const typeClasses: Record<CardType, string[]> = {
		default: ['bg-bg', 'text-fgPrimary'],
		dark: ['bg-bgPrimary', 'text-fgPrimary'],
	}

  return [
    ...baseClasses,
    ...typeClasses[props.type as CardType],
  ]
});
</script>

<template>
	<div :class="cardClasses">
    <slot/>
	</div>
</template>