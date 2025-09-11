import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
// import Films from "../views/Films.vue";
import Callback from "../views/Callback.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", component: Login },
  { path: "/callback", component: Callback },
  // { path: "/films", component: Films, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    return "/";
  }
});

export default router;
