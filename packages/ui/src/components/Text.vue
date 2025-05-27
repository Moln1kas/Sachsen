<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  as: {
    type: String,
    default: 'p',
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

type TextSize = 'sm' | 'base' | 'lg';
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold';

const textClasses = computed(() => {
  const base = ['font-display', 'transition', 'text-fgPrimary'];

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

  const mutedClass = props.muted ? 'text-muted' : '';

  return [
    ...base,
    sizeMap[props.size as TextSize],
    weightMap[props.weight as TextWeight],
    mutedClass,
  ]
});
</script>

<template>
  <component :is="as" :class="textClasses">
    <slot />
  </component>
</template>
