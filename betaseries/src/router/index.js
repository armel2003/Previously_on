import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const OAuthCallback = () => import('../views/OAuthCallback.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login, meta: { public: true } },
    { path: '/callback', name: 'callback', component: OAuthCallback, meta: { public: true } },
  ],
})

// Global auth guard: requires token for non-public routes
router.beforeEach((to) => {
  if (to.meta?.public) return true
  const token = localStorage.getItem('bs_access_token')
  if (!token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
