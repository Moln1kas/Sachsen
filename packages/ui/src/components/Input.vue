<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full',
    'bg-fg',
    'text-black',
    'border-black',
    'border-1',
    'p-1.5',
    'font-display',
    'font-bold',
    'text-base',
    'outline-none'
  ]

  return baseClasses
});

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input 
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    :class="inputClasses"
  />
</template>
