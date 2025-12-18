<script setup lang="ts">
import { computed } from 'vue';
import Stamp from '../base/Stamp.vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const stamp = computed(() => {
  switch (props.status) {
    case 'APPROVED':
      return {'text': 'Подтвержден', 'color': 'green'};
    case 'PENDING':
      return {'text': 'На рассмотрении', 'color': 'blue'};
    case 'BANNED':
      return {'text': 'Забанен', 'color': 'purple'};
    case 'REJECTED':
      return {'text': 'Отклонен', 'color': 'red'};
    default:
      return {'text': 'На рассмотрении', 'color': 'blue'};
  }
})

</script>

<template>
  <Stamp :text="stamp.text" :color="stamp.color" />
</template>