<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import Icon from '../components/Icon.vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const modo = ref('login'); // 'login' | 'cadastro'
const email = ref('');
const senha = ref('');
const mostrarSenha = ref(false);
const carregando = ref(false);
const erro = ref('');
const mensagem = ref('');

async function enviar() {
  erro.value = '';
  mensagem.value = '';
  carregando.value = true;

  try {
    if (modo.value === 'login') {
      await auth.signIn(email.value, senha.value);
      router.push(route.query.redirect || '/');
    } else {
      await auth.signUp(email.value, senha.value);
      mensagem.value = t('login.accountCreated');
      if (auth.isAuthenticated) router.push('/');
    }
  } catch (err) {
    erro.value = err?.message || t('login.authError');
  } finally {
    carregando.value = false;
  }
}

function alternarModo() {
  modo.value = modo.value === 'login' ? 'cadastro' : 'login';
  erro.value = '';
  mensagem.value = '';
}

function alternarIdioma() {
  auth.definirIdioma(locale.value === 'pt-BR' ? 'en' : 'pt-BR');
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-bg px-4 relative">
    <button
      class="absolute top-4 right-4 text-xs font-semibold text-muted hover:text-ink border border-border rounded px-2 py-1"
      @click="alternarIdioma"
    >
      {{ locale === 'pt-BR' ? 'EN' : 'PT' }}
    </button>

    <div class="flex flex-col items-center mb-8">
      <div class="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-lg">
        &gt;_
      </div>
      <h1 class="text-2xl font-bold text-ink mt-4">{{ $t('common.appName') }}</h1>
      <p class="text-sm text-muted mt-1">{{ $t('common.tagline') }}</p>
    </div>

    <form class="w-full max-w-sm card-surface p-6 space-y-4" @submit.prevent="enviar">
      <div>
        <label class="label-field">{{ $t('login.email') }}</label>
        <div class="relative">
          <Icon name="mail" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            v-model="email"
            type="email"
            required
            :placeholder="t('login.emailPlaceholder')"
            class="input-field pl-9"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="label-field mb-0">{{ $t('login.password') }}</label>
          <a href="#" class="text-xs text-primary hover:underline">{{ $t('login.forgotPassword') }}</a>
        </div>
        <div class="relative">
          <Icon name="lock" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            required
            minlength="6"
            :placeholder="t('login.passwordPlaceholder')"
            class="input-field pl-9 pr-9"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            @click="mostrarSenha = !mostrarSenha"
          >
            <Icon name="eye" :size="16" />
          </button>
        </div>
      </div>

      <p v-if="erro" class="text-xs text-red-400">{{ erro }}</p>
      <p v-if="mensagem" class="text-xs text-accent">{{ mensagem }}</p>

      <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2" :disabled="carregando">
        {{ carregando ? $t('login.wait') : modo === 'login' ? $t('login.signIn') : $t('login.createAccount') }}
        <Icon name="chevron-right" :size="16" />
      </button>

      <p class="text-center text-sm text-muted">
        {{ modo === 'login' ? $t('login.noAccount') : $t('login.hasAccount') }}
        <button type="button" class="text-primary font-semibold hover:underline" @click="alternarModo">
          {{ modo === 'login' ? $t('login.createAccount') : $t('login.signIn') }}
        </button>
      </p>
    </form>

    <p class="text-xs text-muted mt-6">{{ $t('common.footer') }}</p>
  </div>
</template>
