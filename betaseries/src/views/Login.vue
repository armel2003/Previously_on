<script setup>
import { onMounted } from 'vue'
import { buildAuthorizeUrl } from '@/services/authService'

function login() {
  const url = buildAuthorizeUrl(crypto.randomUUID?.() || Date.now().toString())
  window.location.href = url
}

onMounted(() => {
  // optional: auto-redirect
})
</script>

<template>
  <section class="container">
    <h1>Connexion à BetaSeries</h1>
    <p>Vous allez être redirigé vers BetaSeries pour autoriser l’application.</p>
    <button @click="login">Se connecter avec BetaSeries</button>
  </section>
  
</template>

<style scoped>
button { padding: .5rem 1rem; }
</style>
