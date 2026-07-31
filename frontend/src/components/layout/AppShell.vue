<script setup>
import Sidebar from './Sidebar.vue';
import CardFormModal from '../CardFormModal.vue';
</script>

<template>
  <div class="flex min-h-screen bg-bg">
    <Sidebar />
    <main class="flex-1 min-w-0">
      <slot />
    </main>
    <CardFormModal />
  </div>
</template>
