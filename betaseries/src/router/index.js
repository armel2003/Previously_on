import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
// import dynamique pour Films et Series
import Callback from "../views/Callback.vue";
import { useAuthStore } from "../stores/auth";
import Detail from "../views/Detail.vue";
import Profil from "../views/Profil.vue";
import Amis from "../views/Amis.vue";
import ProfilAmi from "../views/ProfilAmi.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/callback", component: Callback },
  { path: "/films", component: () => import("../views/Films.vue"), meta: { requiresAuth: true } },
  { path: "/series", component: () => import("../views/Series.vue"), meta: { requiresAuth: true } },
  { path: "/detail/:type/:id", component: Detail, meta: { requiresAuth: true } },
  { path: "/profil", component: Profil, meta: { requiresAuth: true } },
  { path: "/amis", component: Amis, meta: { requiresAuth: true } },
  { path: "/profil-ami/:id", component: ProfilAmi, meta: { requiresAuth: true } },
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
