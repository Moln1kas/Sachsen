<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  level: {
    type: Number,
    default: 2,
    validator: (val: number) => val >= 1 && val <= 6,
  },
  color: {
    type: String,
    default: 'primary'
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

type HeadingColor = 'primary' | 'secondary' | 'dark';
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const tag = computed(() => `h${props.level}`);

const headingClasses = computed(() => {
  const base = ['font-display', 'transition'];

  const sizeMap = {
    1: 'text-2xl',
    2: 'text-1xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm'
  };

  const weightMap: Record<HeadingWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorMap: Record<HeadingColor, string> = {
    primary: 'text-fgPrimary',
    secondary: 'text-fg',
    dark: 'text-fgDark',
  };

  const alignClass = props.align === 'center' ? 'text-center' :
                     props.align === 'right' ? 'text-right' : 'text-left';

  const underlineClass = props.underline ? 'underline' : '';

  return [
    ...base,
    sizeMap[props.level],
    weightMap[props.weight as HeadingWeight],
    colorMap[props.color as HeadingColor],
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
