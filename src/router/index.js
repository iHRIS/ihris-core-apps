import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/vizBuilder/:id?",
      name: "vizBuilder",
      component: () => import("../components/VisualizationBuilder.vue"),
    },
    {
      path: "/dashBuilder/:id?",
      name: "dashBuilder",
      component: () => import("../components/DashboardBuilder.vue"),
      props: true,
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/VizHome.vue"),
    },
    {
      path: "/static/:id",
      name: "static",
      component: () => import("../views/static-page.vue"),
    },
  ],
});

export default router;
