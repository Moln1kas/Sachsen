<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  as: {
    type: String,
    default: 'p',
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'base',
  },
  weight: {
    type: String,
    default: 'normal',
  },
  underline: {
    type: Boolean,
    default: false,
  },
})

type TextColor = 'primary' | 'secondary' | 'dark' | 'green';
type TextSize = 'sm' | 'base' | 'lg';
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

const textClasses = computed(() => {
  const sizeMap: Record<TextSize, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  const weightMap: Record<TextWeight, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorMap: Record<TextColor, string> = {
    primary: 'text-fgPrimary',
    secondary: 'text-fg',
    dark: 'text-fgDark',
    green: 'text-success'
  }

  const underlineClass = props.underline ? 'underline' : '';

  return [
    sizeMap[props.size as TextSize],
    weightMap[props.weight as TextWeight],
    colorMap[props.color as TextColor],
    underlineClass,
  ]
});
</script>

<template>
  <component 
    :is="as"
    class="font-display transition" 
    :class="textClasses"
  >
    <slot />
  </component>
</template>
