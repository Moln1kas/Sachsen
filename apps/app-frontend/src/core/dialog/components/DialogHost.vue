<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listen, emit } from '@tauri-apps/api/event';
import Titlebar from '/src/components/ui/Titlebar.vue'
import type { DialogPayload } from '../types';

import ConfirmDialog from './ConfirmDialog.vue';
import AlertDialog from './AlertDialog.vue';
import PromptDialog from './PromptDialog.vue';

const dialog = ref<DialogPayload | null>(null);
const windowId = new URLSearchParams(window.location.search).get('id')!;


onMounted(async () => {
  console.log(window.location.search)
  emit(`dialog-ready-${windowId}`);

  listen(`dialog-data-${windowId}`, (event) => {
    dialog.value = event.payload as DialogPayload;
  });
});

function close(result: unknown) {
  if (!dialog.value) return;
  emit(`dialog-response-${dialog.value.id}`, result);
}

</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <Titlebar/>
    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-hidden">
        <main class="flex-1 overflow-auto">
          <ConfirmDialog
            v-if="dialog?.type === 'confirm'"
            :title="dialog.title"
            :message="dialog.message"
            @close="close"
          />
          
          <AlertDialog
            v-if="dialog?.type === 'alert'"
            :title="dialog.title"
            :message="dialog.message"
          />

          <PromptDialog
            v-if="dialog?.type === 'prompt'"
            :title="dialog.title"
            :message="dialog.message"
            :placeholder="dialog.placeholder"
            @close="close"
          />
        </main>
      </div>
    </div>
  </div>
</template>
