import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/github/:owner/:repo',
    name: 'GitHubProjectDetail',
    component: () => import('@/views/github/ProjectDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 