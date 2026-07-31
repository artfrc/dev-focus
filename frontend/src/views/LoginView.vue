<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import Icon from '../components/Icon.vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

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
      mensagem.value = 'Conta criada! Verifique seu e-mail para confirmar o cadastro, se necessario.';
      if (auth.isAuthenticated) router.push('/');
    }
  } catch (err) {
    erro.value = err?.message || 'Nao foi possivel autenticar.';
  } finally {
    carregando.value = false;
  }
}

function alternarModo() {
  modo.value = modo.value === 'login' ? 'cadastro' : 'login';
  erro.value = '';
  mensagem.value = '';
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
    <div class="flex flex-col items-center mb-8">
      <div class="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-lg">
        &gt;_
      </div>
      <h1 class="text-2xl font-bold text-ink mt-4">DevFocus</h1>
      <p class="text-sm text-muted mt-1">O seu ambiente de alta performance</p>
    </div>

    <form class="w-full max-w-sm card-surface p-6 space-y-4" @submit.prevent="enviar">
      <div>
        <label class="label-field">E-mail</label>
        <div class="relative">
          <Icon name="mail" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
            class="input-field pl-9"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="label-field mb-0">Senha</label>
          <a href="#" class="text-xs text-primary hover:underline">Esqueci minha senha</a>
        </div>
        <div class="relative">
          <Icon name="lock" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            required
            minlength="6"
            placeholder="********"
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
        {{ carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta' }}
        <Icon name="chevron-right" :size="16" />
      </button>

      <p class="text-center text-sm text-muted">
        {{ modo === 'login' ? 'Nao tem uma conta?' : 'Ja tem uma conta?' }}
        <button type="button" class="text-primary font-semibold hover:underline" @click="alternarModo">
          {{ modo === 'login' ? 'Criar conta' : 'Entrar' }}
        </button>
      </p>
    </form>

    <p class="text-xs text-muted mt-6">DevFocus — organizacao pessoal com gamificacao</p>
  </div>
</template>
