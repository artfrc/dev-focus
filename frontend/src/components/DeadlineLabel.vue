<script setup>
import { computed } from 'vue';

const props = defineProps({
  prazo: { type: String, required: true },
  status: { type: String, default: 'pendente' },
});

const diasRestantes = computed(() => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(`${props.prazo}T00:00:00`);
  return Math.ceil((prazo - hoje) / (24 * 60 * 60 * 1000));
});

const emAlerta = computed(() => props.status === 'pendente' && diasRestantes.value <= 7);

const texto = computed(() => {
  const d = diasRestantes.value;
  if (props.status === 'concluido') return props.prazo;
  if (d < 0) return `Atrasado ha ${Math.abs(d)}d`;
  if (d === 0) return 'Vence hoje';
  if (d === 1) return 'Vence amanha';
  return `${d} dias restantes`;
});
</script>

<template>
  <span class="inline-flex items-center gap-1 text-xs" :class="emAlerta ? 'text-accent font-medium' : 'text-muted'">
    <span v-if="emAlerta">⚠️</span>
    {{ texto }}
  </span>
</template>
