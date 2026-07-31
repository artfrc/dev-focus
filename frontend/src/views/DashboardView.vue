<script setup>
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import PageHeader from '../components/layout/PageHeader.vue';
import Icon from '../components/Icon.vue';
import { useCardsStore } from '../stores/cards.js';
import { useStreakStore } from '../stores/streak.js';
import { useFrasesStore } from '../stores/frases.js';
import { useUiStore } from '../stores/ui.js';

const cardsStore = useCardsStore();
const streakStore = useStreakStore();
const frasesStore = useFrasesStore();
const ui = useUiStore();
const router = useRouter();
const { t, locale } = useI18n();

watch(locale, () => {
  frasesStore.carregarFraseDoDia().catch(() => {});
});

onMounted(() => {
  cardsStore.carregarResumo().catch(() => {});
  streakStore.carregarStreak().catch(() => {});
  frasesStore.carregarFraseDoDia().catch(() => {});
});

const resumo = computed(() => cardsStore.resumo);
const totalCards = computed(() => (resumo.value ? resumo.value.total_pendentes + resumo.value.total_concluidos : 0));
const percentualConcluido = computed(() =>
  totalCards.value ? Math.round((resumo.value.total_concluidos / totalCards.value) * 100) : 0,
);

const barrasProgresso = computed(() => [40, 65, 50, 80, 100, 55, 70]);

function corDeArea(cor) {
  return cor || '#6366F1';
}
</script>

<template>
  <div>
    <PageHeader :title="t('dashboard.title')" />

    <div class="p-8 space-y-6">
      <!-- Streak banner -->
      <div class="card-surface p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
            <Icon name="flame" :size="28" />
          </div>
          <div>
            <p class="text-xs font-semibold text-muted tracking-wide">{{ t('dashboard.streakLabel') }}</p>
            <p class="text-2xl font-bold text-ink">
              {{ t('dashboard.streakValue', { n: streakStore.streak?.sequencia_atual ?? 0 }) }}
            </p>
          </div>
        </div>

        <div class="flex-1 bg-bg border border-border rounded-lg px-4 py-3">
          <p class="text-sm text-muted italic">"{{ frasesStore.fraseDoDia }}"</p>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-surface p-5 border-l-2 border-l-primary">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-muted tracking-wide">{{ t('dashboard.pending') }}</p>
            <Icon name="list" :size="18" class="text-muted" />
          </div>
          <p class="text-3xl font-bold text-ink mt-2">{{ String(resumo?.total_pendentes ?? 0).padStart(2, '0') }}</p>
          <p class="text-xs text-muted mt-1">{{ t('dashboard.pendingHint') }}</p>
        </div>

        <div class="card-surface p-5 border-l-2 border-l-accent">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-muted tracking-wide">{{ t('dashboard.completed') }}</p>
            <Icon name="check" :size="18" class="text-muted" />
          </div>
          <p class="text-3xl font-bold text-ink mt-2">{{ String(resumo?.total_concluidos ?? 0).padStart(2, '0') }}</p>
          <p class="text-xs text-accent mt-1">{{ t('dashboard.completedHint', { percent: percentualConcluido }) }}</p>
        </div>

        <div class="card-surface p-5">
          <p class="text-xs font-semibold text-muted tracking-wide mb-3">{{ t('dashboard.overallProgress') }}</p>
          <div class="flex items-end gap-1.5 h-14">
            <div
              v-for="(altura, idx) in barrasProgresso"
              :key="idx"
              class="flex-1 rounded-t bg-primary/30"
              :class="{ 'bg-primary': idx === barrasProgresso.length - 2 }"
              :style="{ height: altura + '%' }"
            />
          </div>
        </div>
      </div>

      <!-- Cards por area -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-semibold text-ink flex items-center gap-2">
            <Icon name="grid" :size="18" /> {{ t('dashboard.cardsByArea') }}
          </h2>
          <router-link to="/areas" class="text-xs text-primary hover:underline">{{ t('dashboard.viewAll') }}</router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            v-for="area in resumo?.cards_por_area ?? []"
            :key="area.id"
            class="card-surface p-4 text-left hover:border-primary/50 transition-colors"
            @click="router.push(`/areas/${area.id}`)"
          >
            <div class="flex items-center justify-between mb-3">
              <span
                class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                :style="{ backgroundColor: corDeArea(area.cor) + '30', color: corDeArea(area.cor) }"
              >
                {{ area.nome.slice(0, 1).toUpperCase() }}
              </span>
              <span class="badge bg-surface2 text-ink">{{ area.pendentes }}</span>
            </div>
            <p class="text-sm font-semibold text-ink truncate">{{ area.nome }}</p>
            <div class="h-1 bg-border rounded-full mt-2 overflow-hidden">
              <div class="h-full bg-primary" :style="{ width: Math.min(area.pendentes * 20, 100) + '%' }" />
            </div>
          </button>

          <button
            class="card-surface p-4 border-dashed flex flex-col items-center justify-center text-muted hover:text-ink hover:border-primary/50 transition-colors"
            @click="router.push('/configuracoes')"
          >
            <Icon name="plus" :size="18" />
            <span class="text-xs mt-1">{{ t('dashboard.newArea') }}</span>
          </button>
        </div>
      </div>

      <!-- Bottom cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card-surface p-6 bg-gradient-to-br from-primary/20 via-surface to-surface">
          <span class="badge bg-bg/60 text-accent mb-3">{{ t('dashboard.focusTip') }}</span>
          <p class="text-lg font-semibold text-ink">{{ t('dashboard.pomodoroTitle') }}</p>
          <p class="text-sm text-muted mt-2">{{ t('dashboard.pomodoroDesc') }}</p>
        </div>

        <div class="card-surface p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent">
              <Icon name="trophy" :size="20" />
            </div>
            <h3 class="text-base font-semibold text-ink">{{ t('dashboard.nextAchievement') }}</h3>
          </div>
          <p class="text-sm text-muted mb-3">{{ t('dashboard.achievementDesc') }}</p>
          <div class="h-2 bg-border rounded-full overflow-hidden">
            <div
              class="h-full bg-accent"
              :style="{ width: Math.min(((streakStore.streak?.sequencia_atual ?? 0) / 15) * 100, 100) + '%' }"
            />
          </div>
          <p class="text-xs text-muted mt-2 text-right">
            {{ t('dashboard.achievementProgress', { n: streakStore.streak?.sequencia_atual ?? 0 }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
