<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useUiStore } from '../stores/ui.js';
import { useCardsStore } from '../stores/cards.js';
import { useStreakStore } from '../stores/streak.js';
import Icon from './Icon.vue';

const ui = useUiStore();
const cardsStore = useCardsStore();
const streakStore = useStreakStore();

const salvando = ref(false);
const erro = ref('');

const form = reactive({
  descricao: '',
  area_id: '',
  prioridade_id: '',
  prazo: '',
  essencial: false,
});

const emEdicao = computed(() => Boolean(ui.cardEmEdicao));

function resetForm() {
  const card = ui.cardEmEdicao;
  form.descricao = card?.descricao ?? '';
  form.area_id = card?.area_id ?? ui.areaPadraoId ?? cardsStore.areas[0]?.id ?? '';
  form.prioridade_id = card?.prioridade_id ?? cardsStore.prioridades[0]?.id ?? '';
  form.prazo = card?.prazo ?? new Date().toISOString().slice(0, 10);
  form.essencial = card?.essencial ?? false;
  erro.value = '';
}

watch(
  () => ui.cardModalAberto,
  async (aberto) => {
    if (!aberto) return;
    if (cardsStore.areas.length === 0) await cardsStore.carregarAreas().catch(() => {});
    if (cardsStore.prioridades.length === 0) await cardsStore.carregarPrioridades().catch(() => {});
    resetForm();
  },
);

async function salvar() {
  if (!form.descricao.trim() || !form.area_id || !form.prazo) {
    erro.value = 'Preencha descricao, area e prazo.';
    return;
  }

  salvando.value = true;
  erro.value = '';
  try {
    const payload = {
      descricao: form.descricao.trim(),
      area_id: form.area_id,
      prioridade_id: form.prioridade_id || null,
      prazo: form.prazo,
      essencial: form.essencial,
    };

    if (emEdicao.value) {
      await cardsStore.atualizarCard(ui.cardEmEdicao.id, payload);
    } else {
      await cardsStore.criarCard(payload);
    }

    await Promise.allSettled([cardsStore.carregarResumo(), streakStore.carregarStreak()]);
    ui.fecharCardModal();
  } catch (err) {
    erro.value = err?.response?.data?.error || 'Nao foi possivel salvar o card.';
  } finally {
    salvando.value = false;
  }
}

async function excluir() {
  if (!emEdicao.value) return;
  if (!confirm('Excluir este card? Essa acao nao pode ser desfeita.')) return;

  salvando.value = true;
  try {
    await cardsStore.excluirCard(ui.cardEmEdicao.id);
    await Promise.allSettled([cardsStore.carregarResumo(), streakStore.carregarStreak()]);
    ui.fecharCardModal();
  } catch (err) {
    erro.value = err?.response?.data?.error || 'Nao foi possivel excluir o card.';
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="ui.cardModalAberto" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60" @click="ui.fecharCardModal()" />

      <div class="relative w-full max-w-md card-surface p-6 shadow-2xl">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h2 class="text-lg font-semibold text-ink">{{ emEdicao ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
            <p class="text-xs text-muted mt-1">Refine os detalhes para manter o foco maximo.</p>
          </div>
          <button class="text-muted hover:text-ink" @click="ui.fecharCardModal()">
            <Icon name="x" :size="18" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="label-field">Descricao da Tarefa</label>
            <textarea v-model="form.descricao" rows="3" class="input-field resize-none" placeholder="Descreva a tarefa..." />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label-field">Area de Foco</label>
              <select v-model="form.area_id" class="input-field">
                <option v-for="area in cardsStore.areas" :key="area.id" :value="area.id">{{ area.nome }}</option>
              </select>
            </div>
            <div>
              <label class="label-field">Prioridade</label>
              <select v-model="form.prioridade_id" class="input-field">
                <option v-for="p in cardsStore.prioridades" :key="p.id" :value="p.id">{{ p.nome }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 items-end">
            <div>
              <label class="label-field">Prazo Final</label>
              <input v-model="form.prazo" type="date" class="input-field" />
            </div>
            <div class="flex items-center justify-between bg-bg border border-border rounded-lg px-3 py-2.5">
              <span class="text-sm text-ink flex items-center gap-1.5">
                <Icon name="star" :size="14" class="text-accent" /> Essencial
              </span>
              <button
                type="button"
                class="w-10 h-5 rounded-full transition-colors relative"
                :class="form.essencial ? 'bg-primary' : 'bg-border'"
                @click="form.essencial = !form.essencial"
              >
                <span
                  class="absolute top-0.5 w-4 h-4 rounded-full bg-ink transition-all"
                  :class="form.essencial ? 'left-5' : 'left-0.5'"
                />
              </button>
            </div>
          </div>

          <div v-if="form.essencial" class="bg-surface2 border border-accent/30 rounded-lg p-3 text-xs text-accent flex gap-2">
            <span>⚡</span>
            <span>Tarefas essenciais concluidas no prazo mantem sua ofensiva ativa.</span>
          </div>

          <p v-if="erro" class="text-xs text-red-400">{{ erro }}</p>
        </div>

        <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <button
            v-if="emEdicao"
            class="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1.5"
            :disabled="salvando"
            @click="excluir"
          >
            <Icon name="trash" :size="15" /> Excluir Card
          </button>
          <span v-else />

          <div class="flex items-center gap-2">
            <button class="btn-secondary" :disabled="salvando" @click="ui.fecharCardModal()">Cancelar</button>
            <button class="btn-primary" :disabled="salvando" @click="salvar">
              {{ salvando ? 'Salvando...' : 'Salvar Alteracoes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
