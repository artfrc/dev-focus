<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '../components/layout/PageHeader.vue';
import DeadlineLabel from '../components/DeadlineLabel.vue';
import Icon from '../components/Icon.vue';
import { useCardsStore } from '../stores/cards.js';
import { useStreakStore } from '../stores/streak.js';
import { useUiStore } from '../stores/ui.js';

const props = defineProps({ id: { type: String, required: true } });

const cardsStore = useCardsStore();
const streakStore = useStreakStore();
const ui = useUiStore();
const router = useRouter();

const filtroPrioridade = ref('');
const filtroStatus = ref('');

const area = computed(() => cardsStore.areas.find((a) => a.id === props.id));

async function recarregar() {
  const params = { area_id: props.id };
  if (filtroPrioridade.value) params.prioridade_id = filtroPrioridade.value;
  if (filtroStatus.value) params.status = filtroStatus.value;
  await cardsStore.carregarCards(params);
}

onMounted(async () => {
  if (cardsStore.areas.length === 0) await cardsStore.carregarAreas();
  if (cardsStore.prioridades.length === 0) await cardsStore.carregarPrioridades();
  await recarregar();
});

watch(() => props.id, recarregar);
watch([filtroPrioridade, filtroStatus], recarregar);

async function alternarConclusao(card) {
  if (card.status === 'concluido') await cardsStore.reabrirCard(card.id);
  else await cardsStore.concluirCard(card.id);
  streakStore.carregarStreak().catch(() => {});
}

function editar(card) {
  ui.abrirEdicaoCard(card);
}

async function excluir(card) {
  if (!confirm(`Excluir o card "${card.descricao}"?`)) return;
  await cardsStore.excluirCard(card.id);
  streakStore.carregarStreak().catch(() => {});
}
</script>

<template>
  <div>
    <PageHeader :title="`Area: ${area?.nome ?? '...'}`">
      <span class="badge bg-surface2 text-ink border border-border">{{ cardsStore.cards.length }} Tarefas</span>
    </PageHeader>

    <div class="p-8 space-y-5">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          class="btn-secondary text-xs py-1.5"
          :class="{ '!bg-primary !text-ink !border-primary': filtroStatus === '' && filtroPrioridade === '' }"
          @click="(filtroPrioridade = ''), (filtroStatus = '')"
        >
          Tudo
        </button>
        <span class="text-xs text-muted uppercase tracking-wide ml-2">Prioridade:</span>
        <button
          v-for="p in cardsStore.prioridades"
          :key="p.id"
          class="btn-secondary text-xs py-1.5"
          :class="{ '!bg-primary !text-ink !border-primary': filtroPrioridade === p.id }"
          @click="filtroPrioridade = filtroPrioridade === p.id ? '' : p.id"
        >
          {{ p.nome }}
        </button>
        <span class="text-xs text-muted uppercase tracking-wide ml-2">Status:</span>
        <button
          class="btn-secondary text-xs py-1.5"
          :class="{ '!bg-primary !text-ink !border-primary': filtroStatus === 'pendente' }"
          @click="filtroStatus = filtroStatus === 'pendente' ? '' : 'pendente'"
        >
          Pendente
        </button>
        <button
          class="btn-secondary text-xs py-1.5"
          :class="{ '!bg-primary !text-ink !border-primary': filtroStatus === 'concluido' }"
          @click="filtroStatus = filtroStatus === 'concluido' ? '' : 'concluido'"
        >
          Concluido
        </button>
      </div>

      <div class="space-y-2">
        <p v-if="cardsStore.cards.length === 0" class="text-sm text-muted text-center py-10">
          Nenhum card nesta area ainda.
        </p>

        <div
          v-for="card in cardsStore.cards"
          :key="card.id"
          class="card-surface flex items-center gap-4 pl-0 pr-4 py-4 border-l-4"
          :style="{ borderLeftColor: card.prioridades?.cor || '#6366F1' }"
        >
          <button class="ml-4 shrink-0" @click="alternarConclusao(card)">
            <span
              class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
              :class="card.status === 'concluido' ? 'bg-primary border-primary' : 'border-border'"
            >
              <Icon v-if="card.status === 'concluido'" name="check" :size="13" class="text-ink" />
            </span>
          </button>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink" :class="{ 'line-through text-muted': card.status === 'concluido' }">
              {{ card.descricao }}
              <span v-if="card.essencial" class="badge bg-accent/20 text-accent ml-2 align-middle">★ ESSENCIAL</span>
            </p>
            <DeadlineLabel :prazo="card.prazo" :status="card.status" />
          </div>

          <button class="text-muted hover:text-ink p-1" @click="editar(card)">
            <Icon name="pencil" :size="16" />
          </button>
          <button class="text-muted hover:text-red-400 p-1" @click="excluir(card)">
            <Icon name="trash" :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
