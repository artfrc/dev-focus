import { createI18n } from 'vue-i18n';
import ptBR from './locales/pt-BR.js';
import en from './locales/en.js';

export const IDIOMAS_SUPORTADOS = ['pt-BR', 'en'];
export const CHAVE_STORAGE = 'devfocus:idioma';

function idiomaInicial() {
  const salvo = localStorage.getItem(CHAVE_STORAGE);
  if (IDIOMAS_SUPORTADOS.includes(salvo)) return salvo;

  const doNavegador = navigator.language || navigator.languages?.[0] || 'pt-BR';
  return doNavegador.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: idiomaInicial(),
  fallbackLocale: 'pt-BR',
  messages: { 'pt-BR': ptBR, en },
});

/** Aplica um idioma globalmente e persiste a escolha localmente (usado antes do login e como cache). */
export function definirIdiomaGlobal(idioma) {
  if (!IDIOMAS_SUPORTADOS.includes(idioma)) return;
  i18n.global.locale.value = idioma;
  localStorage.setItem(CHAVE_STORAGE, idioma);
  document.documentElement.setAttribute('lang', idioma);
}

export default i18n;
