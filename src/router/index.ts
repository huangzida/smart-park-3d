import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/building-viewer',
    name: 'buildingViewer',
    component: () => import('@/views/BuildingViewer.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
