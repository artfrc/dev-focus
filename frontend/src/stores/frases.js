import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase.js';
import i18n from '../i18n/index.js';
import mensagensEn from '../i18n/locales/en.js';

function diaDoAno() {
  const agora = new Date();
  const inicioAno = new Date(agora.getFullYear(), 0, 0);
  return Math.floor((agora - inicioAno) / (24 * 60 * 60 * 1000));
}

export const useFrasesStore = defineStore('frases', {
  state: () => ({
    fraseDoDia: '',
  }),

  actions: {
    async carregarFraseDoDia() {
      // As frases motivacionais no banco (frases_motivacionais) sao em pt-BR;
      // em ingles usamos uma lista local equivalente para manter a interface no idioma certo.
      if (i18n.global.locale.value === 'en') {
        const frases = mensagensEn.motivationalQuotes;
        this.fraseDoDia = frases[diaDoAno() % frases.length];
        return this.fraseDoDia;
      }

      const { data, error } = await supabase
        .from('frases_motivacionais')
        .select('texto')
        .eq('ativa', true)
        .order('id', { ascending: true });

      if (error || !data?.length) {
        this.fraseDoDia = 'Progresso, não perfeição.';
        return this.fraseDoDia;
      }

      this.fraseDoDia = data[diaDoAno() % data.length].texto;
      return this.fraseDoDia;
    },
  },
});
