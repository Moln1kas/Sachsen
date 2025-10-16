<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'default',
  },
  large: {
    type: Boolean,
    default: false
  }
})

type ButtonType = 'default' | 'accent' | 'danger';

const buttonClasses = computed(() => {
  const baseClasses = [
    'flex',
    'justify-center',
    'items-center',
    'min-w-max',
    'p-1.5',
    'shadow-[inset_0_0_0_1px_black]',
    'select-none',
    'text-base',
    'hover:ring-1',
    'hover:ring-fgPrimary',
    'active:bg-fgDark',
    'active:ring-fgDark',
    'cursor-custom-pointer',
    'disabled:bg-fgDark',
    'disabled:pointer-events-none',
    'transition',
    'font-display',
    'font-bold'
  ];

  const sizeClasses = props.large ? ['px-6', 'py-3', 'text-lg'] : []
  
  const typeClasses: Record<ButtonType, string[]> = {
    default: ['bg-fgPrimary', 'text-black'],
    accent: ['bg-accent', 'text-fgPrimary'],
    danger: ['bg-error', 'text-fg']
  }

  return [
    ...baseClasses,
    ...sizeClasses,
    ...typeClasses[props.type as ButtonType],
  ]
});
</script>

<template>
  <button :disabled="disabled" :class="buttonClasses">
    <slot/>
  </button>
</template>