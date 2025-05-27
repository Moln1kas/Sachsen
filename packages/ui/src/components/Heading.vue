<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    default: 2,
    validator: (val: number) => val >= 1 && val <= 6,
  },
  weight: {
    type: String,
    default: 'bold',
  },
  align: {
    type: String,
    default: 'left',
  },
  underline: {
    type: Boolean,
    default: false,
  }
})

type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const tag = computed(() => `h${props.level}`);

const headingClasses = computed(() => {
  const base = ['font-display', 'text-fgPrimary', 'transition'];

  const sizeMap = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  };

  const weightMap: Record<HeadingWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignClass = props.align === 'center' ? 'text-center' :
                     props.align === 'right' ? 'text-right' : 'text-left';

  const underlineClass = props.underline ? 'underline' : '';

  return [
    ...base,
    sizeMap[props.level],
    weightMap[props.weight as HeadingWeight],
    alignClass,
    underlineClass
  ];
});
</script>

<template>
  <component :is="tag" :class="headingClasses">
    <slot/>
  </component>
</template>
