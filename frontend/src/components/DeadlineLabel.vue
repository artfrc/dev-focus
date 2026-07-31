<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { hojeBrasiliaISO } from '../lib/date.js';
import { useFormatoData } from '../composables/useFormatoData.js';

const props = defineProps({
  prazo: { type: String, required: true },
  status: { type: String, default: 'pendente' },
});

const { t } = useI18n();
const { formatarData } = useFormatoData();

const diasRestantes = computed(() => {
  const hoje = new Date(`${hojeBrasiliaISO()}T00:00:00`);
  const prazo = new Date(`${props.prazo}T00:00:00`);
  return Math.ceil((prazo - hoje) / (24 * 60 * 60 * 1000));
});

const emAlerta = computed(() => props.status === 'pendente' && diasRestantes.value <= 7);

const texto = computed(() => {
  const d = diasRestantes.value;
  const dataFormatada = formatarData(props.prazo);
  if (props.status === 'concluido') return t('deadline.deadlineWas', { date: dataFormatada });
  if (d < 0) return t('deadline.overdue', { n: Math.abs(d), date: dataFormatada });
  if (d === 0) return t('deadline.dueToday');
  if (d === 1) return t('deadline.dueTomorrow');
  return t('deadline.daysLeft', { n: d, date: dataFormatada });
});
</script>

<template>
  <span class="inline-flex items-center gap-1 text-xs" :class="emAlerta ? 'text-accent font-medium' : 'text-muted'">
    <span v-if="emAlerta">⚠️</span>
    {{ texto }}
  </span>
</template>
