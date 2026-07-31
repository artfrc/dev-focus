import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/cards',
    name: 'meus-cards',
    component: () => import('../views/MeusCardsView.vue'),
  },
  {
    path: '/areas',
    name: 'areas',
    component: () => import('../views/AreasView.vue'),
  },
  {
    path: '/areas/:id',
    name: 'area-detalhe',
    component: () => import('../views/AreaDetalheView.vue'),
    props: true,
  },
  {
    path: '/historico',
    name: 'historico',
    component: () => import('../views/HistoricoView.vue'),
  },
  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: () => import('../views/ConfiguracoesView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.ready) await auth.init();

  if (!auth.isAuthenticated && !to.meta.public) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (auth.isAuthenticated && to.name === 'login') {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
