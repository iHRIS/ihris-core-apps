import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
      path: "/static/:id",
      name: "static",
      component: () => import("../views/static-page.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/home.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/home.vue"),
    },

  ]
});

export default router;
