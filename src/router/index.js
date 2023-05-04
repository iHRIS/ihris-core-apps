
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: () => import(/* webpackChunkName: "about" */ '../components/TranslatedLanguages.vue'),
    },
    {
      path: '/review/:locale',
      name: 'review',
      component: () => import(/* webpackChunkName: "about" */ '../components/ReviewTranslations.vue'),
    },
    {
      path: "/static/:id",
      name: "static",
      component: () => import("../views/static-page.vue"),
    },
  ],
});

export default router;
