import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: "/relationshipBuilder",
    name: "relationshipBuilder",
    component: () => import("../components/RelationshipBuilder.vue"),
  }, {
    path: "/static/:id",
    name: "static",
    component: () => import("../views/static-page.vue"),
  }]
});

export default router;
