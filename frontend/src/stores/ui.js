import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    cardModalAberto: false,
    cardEmEdicao: null,
    areaPadraoId: null,
  }),

  actions: {
    abrirNovoCard(areaId = null) {
      this.cardEmEdicao = null;
      this.areaPadraoId = areaId;
      this.cardModalAberto = true;
    },

    abrirEdicaoCard(card) {
      this.cardEmEdicao = card;
      this.areaPadraoId = null;
      this.cardModalAberto = true;
    },

    fecharCardModal() {
      this.cardModalAberto = false;
      this.cardEmEdicao = null;
      this.areaPadraoId = null;
    },
  },
});
