import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase.js';

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
      const { data, error } = await supabase
        .from('frases_motivacionais')
        .select('texto')
        .eq('ativa', true)
        .order('id', { ascending: true });

      if (error || !data?.length) {
        this.fraseDoDia = 'Progresso, nao perfeicao.';
        return this.fraseDoDia;
      }

      this.fraseDoDia = data[diaDoAno() % data.length].texto;
      return this.fraseDoDia;
    },
  },
});
