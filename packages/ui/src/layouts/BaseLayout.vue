<script setup lang="ts"></script>

<template>
  <div class="flex flex-col w-screen h-screen bg-bgPrimary overflow-hidden shadow-[inset_0_0_0_1px_black]">
    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-hidden">
        <main class="flex-1 overflow-auto">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>