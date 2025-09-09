<script setup>
import { useAuthStore } from '../stores/auth'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

function signIn() {
  auth.login()
}

onMounted(async () => {
  // If we arrive here with ?code=..., handle callback then redirect to home
  const { code } = route.query
  if (code) {
    const ok = await auth.handleOAuthCallback(route.query)
    if (ok) router.replace({ name: 'home' })
  }
})
</script>

<template>
  <section class="login">
    <h1>Connexion</h1>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
    <button @click="signIn" :disabled="auth.loading">
      {{ auth.loading ? 'Redirection…' : 'Se connecter avec BetaSeries' }}
    </button>
  </section>
  
</template>

<style scoped>
.login { max-width: 480px; margin: 4rem auto; text-align: center; }
.error { color: #d33; margin-bottom: 1rem; }
button { padding: 0.75rem 1rem; font-weight: 600; border-radius: 8px; }
</style>
