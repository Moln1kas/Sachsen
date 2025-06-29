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
  muted: {
    type: Boolean,
    default: false,
  },
})

type TextColor = 'primary' | 'secondary' | 'dark';
type TextSize = 'sm' | 'base' | 'lg';
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold';

const textClasses = computed(() => {
  const base = ['font-display', 'transition'];

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
  };

  const colorMap: Record<TextColor, string> = {
    primary: 'text-fgPrimary',
    secondary: 'text-fg',
    dark: 'text-fgDark',
  }

  const mutedClass = props.muted ? 'text-muted' : '';

  return [
    ...base,
    sizeMap[props.size as TextSize],
    weightMap[props.weight as TextWeight],
    colorMap[props.color as TextColor],
    mutedClass,
  ]
});
</script>

<template>
  <component :is="as" :class="textClasses">
    <slot />
  </component>
</template>
