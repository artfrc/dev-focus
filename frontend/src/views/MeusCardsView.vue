<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from '../components/layout/PageHeader.vue';
import PriorityDot from '../components/PriorityDot.vue';
import StatusBadge from '../components/StatusBadge.vue';
import DeadlineLabel from '../components/DeadlineLabel.vue';
import Icon from '../components/Icon.vue';
import { useCardsStore } from '../stores/cards.js';
import { useStreakStore } from '../stores/streak.js';
import { useUiStore } from '../stores/ui.js';

const cardsStore = useCardsStore();
const streakStore = useStreakStore();
const ui = useUiStore();
const { t } = useI18n();

const filtros = reactive({ area_id: '', prioridade_id: '', status: '' });
const menuAbertoId = reactive({ id: null });

async function recarregar() {
  const params = {};
  if (filtros.area_id) params.area_id = filtros.area_id;
  if (filtros.prioridade_id) params.prioridade_id = filtros.prioridade_id;
  if (filtros.status) params.status = filtros.status;
  await cardsStore.carregarCards(params);
}

onMounted(async () => {
  await Promise.all([cardsStore.carregarAreas(), cardsStore.carregarPrioridades()]);
  await recarregar();
  streakStore.carregarStreak().catch(() => {});
});

watch(filtros, recarregar, { deep: true });

function limparFiltros() {
  filtros.area_id = '';
  filtros.prioridade_id = '';
  filtros.status = '';
}

const totalPendentes = computed(() => cardsStore.cards.filter((c) => c.status === 'pendente').length);

function alternarMenu(id) {
  menuAbertoId.id = menuAbertoId.id === id ? null : id;
}

async function concluir(card) {
  menuAbertoId.id = null;
  if (card.status === 'concluido') await cardsStore.reabrirCard(card.id);
  else await cardsStore.concluirCard(card.id);
  streakStore.carregarStreak().catch(() => {});
}

function editar(card) {
  menuAbertoId.id = null;
  ui.abrirEdicaoCard(card);
}

async function excluir(card) {
  menuAbertoId.id = null;
  if (!confirm(t('cards.confirmDelete', { name: card.descricao }))) return;
  await cardsStore.excluirCard(card.id);
  streakStore.carregarStreak().catch(() => {});
}
</script>

<template>
  <div>
    <PageHeader :title="t('cards.title')" />

    <div class="p-8 space-y-6">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-ink">{{ t('cards.heading') }}</h2>
          <p class="text-sm text-muted mt-1">{{ t('cards.subheading') }}</p>
        </div>
        <div class="card-surface px-4 py-2.5 text-right">
          <p class="text-xs text-muted tracking-wide">{{ t('cards.totalActive') }}</p>
          <p class="text-lg font-bold text-ink flex items-center gap-1 justify-end">
            <Icon name="clock" :size="16" class="text-accent" /> {{ t('cards.tasksCount', { n: totalPendentes }) }}
          </p>
        </div>
      </div>

      <div class="card-surface p-4 flex flex-wrap items-end gap-3">
        <div class="min-w-[180px]">
          <label class="label-field">{{ t('cards.filterByArea') }}</label>
          <select v-model="filtros.area_id" class="input-field">
            <option value="">{{ t('cards.allAreas') }}</option>
            <option v-for="a in cardsStore.areas" :key="a.id" :value="a.id">{{ a.nome }}</option>
          </select>
        </div>
        <div class="min-w-[180px]">
          <label class="label-field">{{ t('cards.priorityLevel') }}</label>
          <select v-model="filtros.prioridade_id" class="input-field">
            <option value="">{{ t('cards.anyPriority') }}</option>
            <option v-for="p in cardsStore.prioridades" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>
        </div>
        <div class="min-w-[160px]">
          <label class="label-field">{{ t('cards.currentStatus') }}</label>
          <select v-model="filtros.status" class="input-field">
            <option value="">{{ t('cards.allStatuses') }}</option>
            <option value="pendente">{{ t('status.pendente') }}</option>
            <option value="concluido">{{ t('status.concluido') }}</option>
          </select>
        </div>
        <button class="btn-secondary flex items-center gap-1.5" @click="limparFiltros">
          <Icon name="filter" :size="14" /> {{ t('cards.clear') }}
        </button>
      </div>

      <div class="card-surface overflow-visible">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-muted tracking-wide border-b border-border">
              <th class="px-5 py-3 font-medium">{{ t('cards.colTitle') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('cards.colArea') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('cards.colPriority') }}</th>
              <th class="px-5 py-3 font-medium">{{ t('cards.colStatus') }}</th>
              <th class="px-5 py-3 font-medium text-right">{{ t('cards.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cardsStore.cards.length === 0">
              <td colspan="5" class="px-5 py-10 text-center text-muted text-sm">{{ t('cards.noCardsFound') }}</td>
            </tr>
            <tr
              v-for="card in cardsStore.cards"
              :key="card.id"
              class="border-b border-border last:border-b-0 hover:bg-surface2/50"
            >
              <td class="px-5 py-3.5">
                <p class="font-medium text-ink" :class="{ 'line-through text-muted': card.status === 'concluido' }">
                  {{ card.descricao }}
                  <span v-if="card.essencial" class="text-accent" :title="t('cards.essential')">★</span>
                </p>
                <DeadlineLabel :prazo="card.prazo" :status="card.status" />
              </td>
              <td class="px-5 py-3.5">
                <span class="badge bg-surface2 text-ink border border-border">{{ card.areas?.nome ?? '—' }}</span>
              </td>
              <td class="px-5 py-3.5"><PriorityDot :prioridade="card.prioridades" /></td>
              <td class="px-5 py-3.5"><StatusBadge :status="card.status" /></td>
              <td class="px-5 py-3.5 text-right relative">
                <button class="text-muted hover:text-ink p-1" @click="alternarMenu(card.id)">
                  <Icon name="more" :size="18" />
                </button>
                <div
                  v-if="menuAbertoId.id === card.id"
                  class="absolute right-5 top-10 z-10 w-40 card-surface shadow-xl py-1 text-left"
                >
                  <button class="w-full px-3 py-2 text-xs text-ink hover:bg-surface2 flex items-center gap-2" @click="concluir(card)">
                    <Icon name="check" :size="14" /> {{ card.status === 'concluido' ? t('cards.reopen') : t('cards.complete') }}
                  </button>
                  <button class="w-full px-3 py-2 text-xs text-ink hover:bg-surface2 flex items-center gap-2" @click="editar(card)">
                    <Icon name="pencil" :size="14" /> {{ t('common.edit') }}
                  </button>
                  <button class="w-full px-3 py-2 text-xs text-red-400 hover:bg-surface2 flex items-center gap-2" @click="excluir(card)">
                    <Icon name="trash" :size="14" /> {{ t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-surface p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
          <Icon name="flame" :size="18" />
        </div>
        <div>
          <p class="text-xs text-muted tracking-wide">{{ t('cards.currentStreak') }}</p>
          <p class="text-sm font-bold text-ink">
            {{ t('cards.focusedDays', { n: streakStore.streak?.sequencia_atual ?? 0 }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
