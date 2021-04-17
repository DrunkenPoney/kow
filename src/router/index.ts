import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Trust from '@/views/Trust.vue'


const routes: Array<RouteRecordRaw> = [{
  path: '/',
  name: 'Trust',
  component: Trust
}, {
  path: '/results',
  name: 'Results',
  // route level code-splitting
  // this generates a separate chunk (data.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "data" */ '@/views/Results.vue'),
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
