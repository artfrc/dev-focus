<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth.js';
import AppShell from './components/layout/AppShell.vue';

const route = useRoute();
const auth = useAuthStore();

const usaShell = computed(() => auth.isAuthenticated && !route.meta.public);
</script>

<template>
  <AppShell v-if="usaShell">
    <router-view />
  </AppShell>
  <router-view v-else />
</template>
