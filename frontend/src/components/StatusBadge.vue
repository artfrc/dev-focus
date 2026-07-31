<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  status: { type: String, required: true },
});

const { t } = useI18n();

const estilos = {
  pendente: 'bg-surface2 text-muted border border-border',
  concluido: 'bg-accent/15 text-accent border border-accent/30',
};

const classe = computed(() => estilos[props.status] || estilos.pendente);
const rotulo = computed(() => (props.status === 'concluido' ? t('status.concluido') : t('status.pendente')));
</script>

<template>
  <span class="badge" :class="classe">{{ rotulo }}</span>
</template>
