<script setup lang="ts">
import { computed, ref } from 'vue'

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
  },
})

type ButtonType = 'default' | 'secondary' | 'accent' | 'danger' | 'approve';

const buttonRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  focus: () => buttonRef.value?.focus(),
  el: buttonRef
});

const buttonClasses = computed(() => {
  const sizeMap = props.large ? ['px-6', 'py-3', 'text-lg'] : []
  
  const typeMap: Record<ButtonType, string[]> = {
    default: ['bg-fgPrimary', 'text-black'],
    secondary: ['bg-fg', 'text-black'],
    accent: ['bg-accent', 'text-fgPrimary'],
    danger: ['bg-error', 'text-fg'],
    approve: ['bg-success', 'text-fgPrimary']
  }

  return [
    sizeMap,
    typeMap[props.type as ButtonType],
  ]
});
</script>

<template>
  <button
    ref="buttonRef"
    :disabled="disabled"
    class="flex justify-center items-center min-w-max p-1.5 border-black border-1 select-none text-base hover:ring-1 hover:ring-fg active:bg-fgDark active:text-fgPrimary active:ring-fgDark active:fill-fgPrimary cursor-pointer disabled:bg-fgDark disabled:cursor-not-allowed transition font-display font-bold focus:outline-1 focus:outline-fg"
    :class="buttonClasses"
  >
    <slot/>
  </button>
</template>