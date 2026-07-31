import { defineStore } from 'pinia';
import api from '../lib/api.js';

export const useStreakStore = defineStore('streak', {
  state: () => ({
    streak: null,
    historico: [],
  }),

  actions: {
    async carregarStreak() {
      const { data } = await api.get('/streak');
      this.streak = data;
      return data;
    },

    async carregarHistorico(ano, mes) {
      const { data } = await api.get('/streak/historico', { params: { ano, mes } });
      this.historico = data;
      return data;
    },
  },
});
