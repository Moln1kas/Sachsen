<script setup lang="ts">
import { Dropdown } from 'floating-vue'
import 'floating-vue/dist/style.css'
import Text from './Text.vue';
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: 'Выбрать...'
  },
  color: {
    type: String,
    default: 'primary'
  }
})

type ListColor = 'primary' | 'secondary';

const listClasses = computed(() => {
  const colorMap: Record<ListColor, string[]> = {
    primary: ['bg-bgPrimary'],
    secondary: ['bg-bg'],
  }

  return [
    colorMap[props.color as ListColor],
  ];
});
</script>

<template>
  <Dropdown :distance="8" placement="bottom-start">
    <div 
      class="h-full flex items-center select-none justify-between border-1 border-black px-3 py-2 cursor-pointer hover:ring-1 hover:ring-fg transition"
      :class="listClasses"
    >
      <Text size="sm" weight="bold">{{ label }}</Text>
      <Text size="sm">▼</Text>
    </div>

    <template #popper>
      <div class="flex flex-col min-w-[160px] border-1 border-black max-h-[200px] overflow-y-auto custom-scrollbar">
        <slot />
      </div>
    </template>
  </Dropdown>
</template>

<style>
.v-popper__inner, 
.v-popper__wrapper,
.v-popper__content {
  border-radius: 0 !important;
}

.v-popper__inner {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.v-popper__arrow-container {
  display: none !important;
}
</style>