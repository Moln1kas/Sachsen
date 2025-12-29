<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const onInput = (event: Event) => {
  emit(
    'update:modelValue',
    (event.target as HTMLInputElement).checked
  )
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <input 
      :value="modelValue"
      @input="onInput"
      type="checkbox"
      class="w-4 h-4 accent-accent"
    />
    <label class="font-display font-bold text-fg">
      {{ label }}
    </label>
  </div>
</template>
