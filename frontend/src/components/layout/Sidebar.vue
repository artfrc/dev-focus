<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';
import { useUiStore } from '../../stores/ui.js';
import Icon from '../Icon.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();
const { t, locale } = useI18n();

async function sair() {
  await auth.signOut();
  router.push({ name: 'login' });
}

async function alternarIdioma() {
  await auth.definirIdioma(locale.value === 'pt-BR' ? 'en' : 'pt-BR');
}

const navItems = computed(() => [
  { name: 'dashboard', label: t('nav.dashboard'), icon: 'grid', to: '/' },
  { name: 'meus-cards', label: t('nav.myCards'), icon: 'list', to: '/cards' },
  { name: 'areas', label: t('nav.areas'), icon: 'layers', to: '/areas' },
  { name: 'historico', label: t('nav.history'), icon: 'history', to: '/historico' },
  { name: 'configuracoes', label: t('nav.settings'), icon: 'settings', to: '/configuracoes' },
]);

const rotaAtiva = computed(() => route.name);

const iniciais = computed(() => {
  const email = auth.user?.email || '';
  return email.slice(0, 2).toUpperCase();
});
</script>

<template>
  <aside class="w-[220px] shrink-0 h-screen sticky top-0 bg-surface border-r border-border flex flex-col">
    <div class="px-5 pt-6 pb-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
            &gt;_
          </div>
          <span class="font-bold text-lg text-ink">{{ $t('common.appName') }}</span>
        </div>

        <button
          class="text-[11px] font-semibold text-muted hover:text-ink border border-border rounded px-1.5 py-1 shrink-0"
          :title="t('language.switchTo', { lang: locale === 'pt-BR' ? 'English' : 'Português' })"
          @click="alternarIdioma"
        >
          {{ locale === 'pt-BR' ? 'PT' : 'EN' }}
        </button>
      </div>
      <p class="text-xs text-muted mt-1 ml-10">{{ $t('nav.levelLabel') }}</p>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border border-dashed transition-colors"
        :class="
          rotaAtiva === item.name || (item.name === 'areas' && rotaAtiva === 'area-detalhe')
            ? 'bg-surface2 text-ink border-primary/50'
            : 'text-muted border-transparent hover:text-ink hover:border-primary/30'
        "
      >
        <Icon :name="item.icon" :size="18" />
        {{ item.label }}
      </router-link>
    </nav>

    <div class="p-3 mt-auto space-y-3">
      <div class="flex items-center gap-2 px-2 py-2 rounded-lg bg-surface2 border border-border">
        <div class="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
          {{ iniciais || 'DF' }}
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-ink truncate">{{ auth.user?.email || 'Dev Profile' }}</p>
          <p class="text-[11px] text-accent flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-accent inline-block" /> {{ $t('nav.active') }}
          </p>
        </div>
        <button
          class="ml-auto text-muted hover:text-ink"
          :title="t('nav.signOut')"
          @click="sair"
        >
          <Icon name="logout" :size="16" />
        </button>
      </div>

      <button class="btn-primary w-full flex items-center justify-center gap-2" @click="ui.abrirNovoCard()">
        <Icon name="plus" :size="16" />
        {{ $t('nav.newTask') }}
      </button>
    </div>
  </aside>
</template>
