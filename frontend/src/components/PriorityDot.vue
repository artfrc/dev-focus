<script setup>
defineProps({
  prioridade: { type: Object, default: null },
});
</script>

<template>
  <span v-if="prioridade" class="inline-flex items-center gap-1.5 text-xs font-medium text-ink">
    <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: prioridade.cor }" />
    {{ prioridade.nome }}
  </span>
  <span v-else class="text-xs text-muted">—</span>
</template>
