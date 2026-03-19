<script setup lang="ts">
import { SquareIcon } from '@repo/assets';
import Text from './Text.vue';

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

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div 
    class="flex gap-3 items-center cursor-pointer group select-none"
    @click="toggle"
  >
    <div 
      class="w-5 h-5 flex items-center justify-center border-1 border-black transition-all group-hover:ring-1 group-hover:ring-fg"
      :class="[props.modelValue ? 'bg-fgDark' : 'bg-bgPrimary']"
    >
      <svg 
        v-if="props.modelValue"
        class="w-3.5 h-3.5 fill-none stroke-fgPrimary" 
        viewBox="0 0 24 24" 
        stroke-width="4"
        stroke-linecap="square"
      >
        <path d="M20 6L9 17L4 12" />
      </svg>
    </div>

    <Text 
      v-if="props.label" 
      size="sm" 
      weight="semibold" 
      class="cursor-pointer"
    >
      {{ props.label }}
    </Text>

    <input 
      type="checkbox" 
      :checked="props.modelValue" 
      class="hidden" 
    />
  </div>
</template>