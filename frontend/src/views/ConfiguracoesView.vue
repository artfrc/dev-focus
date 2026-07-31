<script setup>
import { onMounted, reactive, ref } from 'vue';
import PageHeader from '../components/layout/PageHeader.vue';
import Icon from '../components/Icon.vue';
import { useCardsStore } from '../stores/cards.js';

const cardsStore = useCardsStore();

onMounted(async () => {
  await Promise.all([cardsStore.carregarAreas(), cardsStore.carregarPrioridades(), cardsStore.carregarResumo()]);
});

// --- Areas ---
const novaAreaNome = ref('');
const areaEditandoId = ref(null);
const areaEditForm = reactive({ nome: '', cor: '' });

function iniciarEdicaoArea(area) {
  areaEditandoId.value = area.id;
  areaEditForm.nome = area.nome;
  areaEditForm.cor = area.cor || '#6366F1';
}

async function salvarArea(area) {
  await cardsStore.atualizarArea(area.id, { nome: areaEditForm.nome, cor: areaEditForm.cor });
  areaEditandoId.value = null;
}

async function criarArea() {
  if (!novaAreaNome.value.trim()) return;
  await cardsStore.criarArea({ nome: novaAreaNome.value.trim(), cor: '#6366F1' });
  novaAreaNome.value = '';
}

async function excluirArea(area) {
  if (!confirm(`Excluir a area "${area.nome}"? Os cards vinculados tambem serao removidos.`)) return;
  await cardsStore.excluirArea(area.id);
}

function pendentesDe(areaId) {
  return cardsStore.resumo?.cards_por_area?.find((a) => a.id === areaId)?.pendentes ?? 0;
}

// --- Prioridades ---
const prioridadeEditandoId = ref(null);
const prioridadeEditForm = reactive({ nome: '', cor: '', ordem: 1 });
const novaPrioridade = reactive({ nome: '', cor: '#6366F1', ordem: 1 });
const mostrandoFormNovaPrioridade = ref(false);

function iniciarEdicaoPrioridade(p) {
  prioridadeEditandoId.value = p.id;
  prioridadeEditForm.nome = p.nome;
  prioridadeEditForm.cor = p.cor;
  prioridadeEditForm.ordem = p.ordem;
}

async function salvarPrioridade(p) {
  await cardsStore.atualizarPrioridade(p.id, { ...prioridadeEditForm });
  prioridadeEditandoId.value = null;
}

async function excluirPrioridade(p) {
  if (!confirm(`Excluir a prioridade "${p.nome}"?`)) return;
  await cardsStore.excluirPrioridade(p.id);
}

async function criarPrioridade() {
  if (!novaPrioridade.nome.trim()) return;
  await cardsStore.criarPrioridade({ ...novaPrioridade, ordem: Number(novaPrioridade.ordem) || cardsStore.prioridades.length + 1 });
  novaPrioridade.nome = '';
  novaPrioridade.cor = '#6366F1';
  novaPrioridade.ordem = cardsStore.prioridades.length + 1;
  mostrandoFormNovaPrioridade.value = false;
}
</script>

<template>
  <div>
    <PageHeader title="Configuracoes" :show-add-button="false" />

    <div class="p-8 space-y-10">
      <section>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-ink">Areas de Atuacao</h2>
            <p class="text-sm text-muted">Gerencie os dominios do seu ecossistema.</p>
          </div>
        </div>

        <form class="flex items-center gap-2 max-w-sm mb-4" @submit.prevent="criarArea">
          <input v-model="novaAreaNome" type="text" placeholder="Nome da nova area..." class="input-field" />
          <button type="submit" class="btn-primary shrink-0 flex items-center gap-1.5">
            <Icon name="plus" :size="14" /> Adicionar
          </button>
        </form>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="area in cardsStore.areas" :key="area.id" class="card-surface p-4">
            <div v-if="areaEditandoId === area.id" class="flex items-center gap-2">
              <input v-model="areaEditForm.nome" type="text" class="input-field" />
              <input v-model="areaEditForm.cor" type="color" class="w-9 h-9 rounded border border-border bg-transparent shrink-0" />
              <button class="text-accent p-1" @click="salvarArea(area)"><Icon name="check" :size="16" /></button>
              <button class="text-muted p-1" @click="areaEditandoId = null"><Icon name="x" :size="16" /></button>
            </div>
            <div v-else class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                :style="{ backgroundColor: (area.cor || '#6366F1') + '30', color: area.cor || '#6366F1' }"
              >
                {{ area.nome.slice(0, 1).toUpperCase() }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-ink truncate">{{ area.nome }}</p>
                <p class="text-xs text-muted">{{ pendentesDe(area.id) }} Tarefas Ativas</p>
              </div>
              <button class="text-muted hover:text-ink p-1" @click="iniciarEdicaoArea(area)"><Icon name="pencil" :size="15" /></button>
              <button class="text-muted hover:text-red-400 p-1" @click="excluirArea(area)"><Icon name="trash" :size="15" /></button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-ink">Prioridades &amp; Identidade</h2>
            <p class="text-sm text-muted">Defina as cores que classificam a urgencia das suas tarefas.</p>
          </div>
          <button class="btn-secondary flex items-center gap-1.5 text-xs" @click="mostrandoFormNovaPrioridade = !mostrandoFormNovaPrioridade">
            <Icon name="plus" :size="14" /> Nova Prioridade
          </button>
        </div>

        <div v-if="mostrandoFormNovaPrioridade" class="card-surface p-4 mb-3 flex flex-wrap items-end gap-3">
          <div>
            <label class="label-field">Nome</label>
            <input v-model="novaPrioridade.nome" type="text" class="input-field" placeholder="Ex: Urgente" />
          </div>
          <div>
            <label class="label-field">Cor</label>
            <input v-model="novaPrioridade.cor" type="color" class="w-16 h-10 rounded border border-border bg-transparent" />
          </div>
          <div>
            <label class="label-field">Ordem</label>
            <input v-model.number="novaPrioridade.ordem" type="number" min="1" class="input-field w-20" />
          </div>
          <button class="btn-primary" @click="criarPrioridade">Salvar</button>
        </div>

        <div class="card-surface overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-muted tracking-wide border-b border-border">
                <th class="px-5 py-3 font-medium">NOME DA PRIORIDADE</th>
                <th class="px-5 py-3 font-medium">COR IDENTIFICADORA</th>
                <th class="px-5 py-3 font-medium">ORDEM</th>
                <th class="px-5 py-3 font-medium text-right">ACOES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in cardsStore.prioridades" :key="p.id" class="border-b border-border last:border-b-0">
                <td class="px-5 py-3.5">
                  <input v-if="prioridadeEditandoId === p.id" v-model="prioridadeEditForm.nome" class="input-field" />
                  <span v-else class="text-ink font-medium">{{ p.nome }}</span>
                </td>
                <td class="px-5 py-3.5">
                  <input v-if="prioridadeEditandoId === p.id" v-model="prioridadeEditForm.cor" type="color" class="w-9 h-9 rounded border border-border bg-transparent" />
                  <span v-else class="w-4 h-4 rounded-full inline-block" :style="{ backgroundColor: p.cor }" />
                </td>
                <td class="px-5 py-3.5">
                  <input v-if="prioridadeEditandoId === p.id" v-model.number="prioridadeEditForm.ordem" type="number" min="1" class="input-field w-20" />
                  <span v-else class="text-muted">{{ p.ordem }}</span>
                </td>
                <td class="px-5 py-3.5 text-right space-x-2">
                  <template v-if="prioridadeEditandoId === p.id">
                    <button class="text-accent p-1" @click="salvarPrioridade(p)"><Icon name="check" :size="15" /></button>
                    <button class="text-muted p-1" @click="prioridadeEditandoId = null"><Icon name="x" :size="15" /></button>
                  </template>
                  <template v-else>
                    <button class="text-primary text-xs font-medium hover:underline" @click="iniciarEdicaoPrioridade(p)">Configurar</button>
                    <button class="text-red-400 p-1 align-middle" @click="excluirPrioridade(p)"><Icon name="trash" :size="14" /></button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
