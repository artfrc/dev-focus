import { defineStore } from 'pinia';
import api from '../lib/api.js';

export const useCardsStore = defineStore('cards', {
  state: () => ({
    areas: [],
    prioridades: [],
    cards: [],
    resumo: null,
    carregando: false,
  }),

  actions: {
    async carregarAreas() {
      const { data } = await api.get('/areas');
      this.areas = data;
      return data;
    },

    async criarArea(payload) {
      const { data } = await api.post('/areas', payload);
      this.areas.push(data);
      return data;
    },

    async atualizarArea(id, payload) {
      const { data } = await api.patch(`/areas/${id}`, payload);
      const idx = this.areas.findIndex((a) => a.id === id);
      if (idx !== -1) this.areas[idx] = data;
      return data;
    },

    async excluirArea(id) {
      await api.delete(`/areas/${id}`);
      this.areas = this.areas.filter((a) => a.id !== id);
    },

    async carregarPrioridades() {
      const { data } = await api.get('/prioridades');
      this.prioridades = data;
      return data;
    },

    async criarPrioridade(payload) {
      const { data } = await api.post('/prioridades', payload);
      this.prioridades.push(data);
      return data;
    },

    async atualizarPrioridade(id, payload) {
      const { data } = await api.patch(`/prioridades/${id}`, payload);
      const idx = this.prioridades.findIndex((p) => p.id === id);
      if (idx !== -1) this.prioridades[idx] = data;
      return data;
    },

    async excluirPrioridade(id) {
      await api.delete(`/prioridades/${id}`);
      this.prioridades = this.prioridades.filter((p) => p.id !== id);
    },

    async carregarCards(filtros = {}) {
      this.carregando = true;
      try {
        const { data } = await api.get('/cards', { params: filtros });
        this.cards = data;
        return data;
      } finally {
        this.carregando = false;
      }
    },

    async criarCard(payload) {
      const { data } = await api.post('/cards', payload);
      this.cards.unshift(data);
      return data;
    },

    async atualizarCard(id, payload) {
      const { data } = await api.patch(`/cards/${id}`, payload);
      const idx = this.cards.findIndex((c) => c.id === id);
      if (idx !== -1) this.cards[idx] = data;
      return data;
    },

    async concluirCard(id) {
      const { data } = await api.post(`/cards/${id}/concluir`);
      const idx = this.cards.findIndex((c) => c.id === id);
      if (idx !== -1) this.cards[idx] = data;
      return data;
    },

    async reabrirCard(id) {
      const { data } = await api.post(`/cards/${id}/reabrir`);
      const idx = this.cards.findIndex((c) => c.id === id);
      if (idx !== -1) this.cards[idx] = data;
      return data;
    },

    async excluirCard(id) {
      await api.delete(`/cards/${id}`);
      this.cards = this.cards.filter((c) => c.id !== id);
    },

    async carregarResumo() {
      const { data } = await api.get('/resumo');
      this.resumo = data;
      return data;
    },
  },
});
