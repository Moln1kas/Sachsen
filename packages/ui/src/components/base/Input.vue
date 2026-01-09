<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'base',
  },
  weight: {
    type: String,
    default: 'normal',
  },
})

type InputColor = 'default' | 'dark' | 'glass';
type TextSize = 'sm' | 'base' | 'lg';
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

const InputClasses = computed(() => {
  const colorMap: Record<InputColor, string[]> = {
		default: ['bg-fg', 'text-black'],
		dark: ['bg-bgPrimary', 'text-fgPrimary'],
    glass: ['bg-bgPrimary/40', 'backdrop-blur-sm', 'text-fg']
	}

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

  return [
    colorMap[props.color as InputColor],
    sizeMap[props.size as TextSize],
    weightMap[props.weight as TextWeight]
  ]
});

const emit = defineEmits(['update:modelValue'])

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const inputRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  focus: () => inputRef.value?.focus(),
  el: inputRef
});
</script>

<template>
  <input
    ref="inputRef"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    class="w-full border-black border-1 p-1.5 font-display font-bold text-base outline-none cursor-text"
    :class="InputClasses"
  />
</template>
