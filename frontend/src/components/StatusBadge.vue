<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
});

const estilos = {
  pendente: 'bg-surface2 text-muted border border-border',
  concluido: 'bg-accent/15 text-accent border border-accent/30',
};

const rotulos = {
  pendente: 'Pendente',
  concluido: 'Concluido',
};

const classe = computed(() => estilos[props.status] || estilos.pendente);
const rotulo = computed(() => rotulos[props.status] || props.status);
</script>

<template>
  <span class="badge" :class="classe">{{ rotulo }}</span>
</template>
