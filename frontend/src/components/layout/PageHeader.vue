<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '../../stores/ui.js';
import { useStreakStore } from '../../stores/streak.js';
import Icon from '../Icon.vue';

defineProps({
  title: { type: String, required: true },
  showAddButton: { type: Boolean, default: true },
});

const ui = useUiStore();
const streak = useStreakStore();
const router = useRouter();

onMounted(() => {
  if (!streak.streak) streak.carregarStreak().catch(() => {});
});
</script>

<template>
  <header class="flex items-center justify-between gap-4 px-8 py-5 border-b border-border">
    <div class="flex items-center gap-3 min-w-0">
      <h1 class="text-xl font-semibold text-ink truncate">{{ title }}</h1>
      <slot />
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <div class="relative hidden sm:block">
        <Icon name="search" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Buscar tarefas..."
          class="bg-bg border border-border rounded-full text-sm pl-9 pr-4 py-2 w-56 text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        class="flex items-center gap-1 text-accent hover:text-ink transition-colors"
        title="Ofensiva atual"
        @click="router.push('/historico')"
      >
        <Icon name="flame" :size="20" />
        <span class="text-sm font-semibold">{{ streak.streak?.sequencia_atual ?? 0 }}</span>
      </button>

      <button class="text-muted hover:text-ink transition-colors" title="Notificacoes">
        <Icon name="bell" :size="20" />
      </button>

      <button v-if="showAddButton" class="btn-primary flex items-center gap-2" @click="ui.abrirNovoCard()">
        <Icon name="plus" :size="16" />
        Add Task
      </button>
    </div>
  </header>
</template>
