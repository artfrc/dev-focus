<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from '../components/layout/PageHeader.vue';
import Icon from '../components/Icon.vue';
import { useStreakStore } from '../stores/streak.js';
import { hojeBrasiliaISO } from '../lib/date.js';

const streakStore = useStreakStore();
const { t, tm } = useI18n();

const hojeISO = hojeBrasiliaISO();
const [anoInicial, mesInicial] = hojeISO.split('-');
const ano = ref(Number(anoInicial));
const mes = ref(Number(mesInicial)); // 1-12

async function carregar() {
  await streakStore.carregarHistorico(ano.value, mes.value);
}

onMounted(async () => {
  await streakStore.carregarStreak();
  await carregar();
});

watch([ano, mes], carregar);

function mesAnterior() {
  if (mes.value === 1) {
    mes.value = 12;
    ano.value -= 1;
  } else {
    mes.value -= 1;
  }
}

function proximoMes() {
  if (mes.value === 12) {
    mes.value = 1;
    ano.value += 1;
  } else {
    mes.value += 1;
  }
}

const historicoPorDia = computed(() => {
  const mapa = {};
  for (const item of streakStore.historico) mapa[item.data] = item.meta_batida;
  return mapa;
});

const celulasCalendario = computed(() => {
  const primeiroDia = new Date(ano.value, mes.value - 1, 1);
  const totalDias = new Date(ano.value, mes.value, 0).getDate();
  const offset = primeiroDia.getDay();

  const celulas = [];
  for (let i = 0; i < offset; i++) celulas.push(null);
  for (let dia = 1; dia <= totalDias; dia++) {
    const iso = `${ano.value}-${String(mes.value).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    celulas.push({ dia, iso, batida: historicoPorDia.value[iso], hoje: iso === hojeISO });
  }
  return celulas;
});

const metaPercentual = computed(() => {
  const total = streakStore.historico.length;
  if (!total) return 0;
  const batidas = streakStore.historico.filter((h) => h.meta_batida).length;
  return Math.round((batidas / total) * 100);
});
</script>

<template>
  <div>
    <PageHeader :title="t('history.title')" :show-add-button="false">
      <span class="text-xs text-muted">{{ t('history.subtitle') }}</span>
    </PageHeader>

    <div class="p-8 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="card-surface p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
            <Icon name="flame" :size="22" />
          </div>
          <div>
            <p class="text-xs text-muted">{{ t('history.currentSequence') }}</p>
            <p class="text-2xl font-bold text-ink">
              {{ streakStore.streak?.sequencia_atual ?? 0 }} <span class="text-sm font-normal text-muted">{{ t('common.days') }}</span>
            </p>
            <p class="text-[11px] text-accent">{{ t('history.activeFocus') }}</p>
          </div>
        </div>

        <div class="card-surface p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary">
            <Icon name="trophy" :size="22" />
          </div>
          <div>
            <p class="text-xs text-muted">{{ t('history.bestRecord') }}</p>
            <p class="text-2xl font-bold text-ink">
              {{ streakStore.streak?.maior_sequencia ?? 0 }} <span class="text-sm font-normal text-muted">{{ t('common.days') }}</span>
            </p>
            <p class="text-[11px] text-muted">{{ t('history.bestRecordHint') }}</p>
          </div>
        </div>
      </div>

      <div class="card-surface p-5">
        <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold text-ink">{{ tm('history.months')[mes - 1] }} {{ ano }}</h2>
            <span class="badge bg-accent/15 text-accent">{{ t('history.goal', { percent: metaPercentual }) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-secondary text-xs py-1.5 flex items-center gap-1" @click="mesAnterior">
              <Icon name="chevron-left" :size="14" /> {{ t('history.previous') }}
            </button>
            <button class="btn-secondary text-xs py-1.5 flex items-center gap-1" @click="proximoMes">
              {{ t('history.next') }} <Icon name="chevron-right" :size="14" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-xs text-muted mb-2">
          <span v-for="d in tm('history.weekdays')" :key="d">{{ d }}</span>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div v-for="(cel, idx) in celulasCalendario" :key="idx" class="aspect-square">
            <div
              v-if="cel"
              class="w-full h-full rounded-lg border flex flex-col items-center justify-center gap-1 text-xs"
              :class="[
                cel.hoje ? 'border-primary bg-primary/10 text-ink' : cel.batida ? 'border-accent/40 bg-accent/10 text-ink' : 'border-border text-muted',
              ]"
            >
              <span class="font-semibold">{{ cel.dia }}</span>
              <span v-if="cel.hoje" class="text-[9px] text-primary font-semibold">{{ t('history.todayBadge') }}</span>
              <span v-else-if="cel.batida" class="text-[9px] text-accent font-semibold">{{ t('history.goalMetBadge') }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-5 mt-5 text-xs text-muted">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-accent/20 border border-accent/40 inline-block" /> {{ t('history.goalMet') }}
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-surface2 border border-border inline-block" /> {{ t('history.incompleteFocus') }}
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-primary/20 border border-primary inline-block" /> {{ t('history.today') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
