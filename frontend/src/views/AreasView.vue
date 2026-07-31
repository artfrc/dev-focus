<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import PageHeader from '../components/layout/PageHeader.vue';
import Icon from '../components/Icon.vue';
import { useCardsStore } from '../stores/cards.js';

const cardsStore = useCardsStore();
const router = useRouter();
const { t } = useI18n();

const novaAreaNome = ref('');
const criando = ref(false);

onMounted(async () => {
  await Promise.all([cardsStore.carregarAreas(), cardsStore.carregarResumo()]);
});

function pendentesDe(areaId) {
  return cardsStore.resumo?.cards_por_area?.find((a) => a.id === areaId)?.pendentes ?? 0;
}

async function criarArea() {
  if (!novaAreaNome.value.trim()) return;
  criando.value = true;
  try {
    await cardsStore.criarArea({ nome: novaAreaNome.value.trim() });
    novaAreaNome.value = '';
    await cardsStore.carregarResumo();
  } finally {
    criando.value = false;
  }
}
</script>

<template>
  <div>
    <PageHeader :title="t('areas.title')" :show-add-button="false" />

    <div class="p-8 space-y-6">
      <form class="flex items-center gap-2 max-w-md" @submit.prevent="criarArea">
        <input v-model="novaAreaNome" type="text" :placeholder="t('areas.newAreaPlaceholder')" class="input-field" />
        <button type="submit" class="btn-primary shrink-0" :disabled="criando">{{ t('common.create') }}</button>
      </form>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="area in cardsStore.areas"
          :key="area.id"
          class="card-surface p-5 text-left hover:border-primary/50 transition-colors"
          @click="router.push(`/areas/${area.id}`)"
        >
          <div class="flex items-center justify-between">
            <span
              class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
              :style="{ backgroundColor: (area.cor || '#6366F1') + '30', color: area.cor || '#6366F1' }"
            >
              {{ area.nome.slice(0, 1).toUpperCase() }}
            </span>
            <span class="badge bg-surface2 text-ink">{{ pendentesDe(area.id) }} {{ t('areas.pending') }}</span>
          </div>
          <p class="text-base font-semibold text-ink mt-3">{{ area.nome }}</p>
          <p class="text-xs text-muted mt-1 flex items-center gap-1">
            {{ t('areas.viewCards') }} <Icon name="chevron-right" :size="14" />
          </p>
        </button>
      </div>
    </div>
  </div>
</template>
