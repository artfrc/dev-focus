import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase.js';

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

      supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
        this.user = session?.user ?? null;
      });
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.session = data.session;
      this.user = data.user;
    },

    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      this.session = data.session;
      this.user = data.user;
    },

    async signOut() {
      await supabase.auth.signOut();
      this.session = null;
      this.user = null;
    },
  },
});
