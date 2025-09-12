<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
</script>

<template>
  <section>
    <h1>Bienvenue</h1>
    <p v-if="!isAuthenticated">Connectez-vous pour continuer.</p>
    <RouterLink v-if="!isAuthenticated" to="/login">Se connecter</RouterLink>
    <p v-else>Vous êtes connecté.</p>
  </section>
</template>

<style scoped>
section { padding: 1rem; }
</style>
