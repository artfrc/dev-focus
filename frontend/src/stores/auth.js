import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase.js';
import { IDIOMAS_SUPORTADOS, definirIdiomaGlobal } from '../i18n/index.js';

/** Aplica o idioma salvo no perfil do usuario (user_metadata), se houver. */
function aplicarIdiomaDoUsuario(user) {
  const idioma = user?.user_metadata?.idioma;
  if (IDIOMAS_SUPORTADOS.includes(idioma)) definirIdiomaGlobal(idioma);
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: null,
    user: null,
    ready: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.session),
  },

  actions: {
    async init() {
      const { data } = await supabase.auth.getSession();
      this.session = data.session;
      this.user = data.session?.user ?? null;
      this.ready = true;
      aplicarIdiomaDoUsuario(this.user);

      supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
        this.user = session?.user ?? null;
        aplicarIdiomaDoUsuario(this.user);
      });
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.session = data.session;
      this.user = data.user;
      aplicarIdiomaDoUsuario(this.user);
    },

    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      this.session = data.session;
      this.user = data.user;
      aplicarIdiomaDoUsuario(this.user);
    },

    async signOut() {
      await supabase.auth.signOut();
      this.session = null;
      this.user = null;
    },

    /** Troca o idioma na interface e, se autenticado, persiste no perfil (user_metadata) para os proximos logins. */
    async definirIdioma(idioma) {
      definirIdiomaGlobal(idioma);
      if (!this.isAuthenticated) return;

      const { data, error } = await supabase.auth.updateUser({ data: { idioma } });
      if (error) throw error;
      this.user = data.user;
    },
  },
});
