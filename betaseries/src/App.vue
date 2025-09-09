<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
function logout() {
  auth.logout()
}
</script>

<template>
  <header class="container">
    <nav>
      <RouterLink to="/">Home</RouterLink>
  <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
  <button v-else @click="logout">Logout</button>
    </nav>
  </header>
  <main class="container">
    <RouterView />
  </main>
  
  
</template>

