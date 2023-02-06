
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/viz2',
  name: 'viz2',
  component: () => import('../components/DataVisualizer2.vue')
}, {
  path: '/vizBuilder/:id?',
  name: 'vizBuilder',
  component: () => import('../components/VisualizationBuilder.vue')
}, {
  path: '/dashBuilder/:id?',
  name: 'dashBuilder',
  component: () => import('../components/DashboardBuilder.vue'),
  props: true
}, {
  path: '/home',
  name: 'home',
  component: () => import('../views/VizHome.vue')
}]

const router = new VueRouter({
  routes
})

export default router
