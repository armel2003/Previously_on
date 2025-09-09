<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'


</script>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
function doLogout(){ auth.logout(); router.push({ name: 'login' }) }

<template>
  <!-- <header>
  <header style="display:flex;gap:1rem;align-items:center;justify-content:space-between;padding:1rem 2rem;border-bottom:1px solid #eee;">
    <strong>Previously On</strong>
    <nav style="display:flex;gap:1rem;align-items:center;">
      <RouterLink :to="{name:'home'}">Accueil</RouterLink>
      <RouterLink :to="{name:'about'}">À propos</RouterLink>
      <template v-if="auth.isAuthenticated">
        <span v-if="auth.user">Bonjour, {{ auth.user?.login || auth.user?.username }}</span>
        <button @click="doLogout">Se déconnecter</button>
      </template>
      <template v-else>
        <RouterLink :to="{name:'login'}">Se connecter</RouterLink>
      </template>
    </nav>
  </header>
  <!-- <RouterView /> -->
</template>

