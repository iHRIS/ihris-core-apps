import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
      path: "/static/:id",
      name: "static",
      component: () => import("../views/static-page.vue"),
    }]
});

export default router;
