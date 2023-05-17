import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/static/:id",
      name: "static",
      component: () => import("../views/static-page.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/TransHome.vue"),
    },
    {
      path: "/review/:locale",
      name: "review",
      component: () => import("../components/ReviewTranslations.vue"),
    },
  ],
});

export default router;
