<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const message = ref('Traitement en cours...')

onMounted(async () => {
  const code = route.query.code
  const error = route.query.error
  if (error) {
    message.value = `Erreur: ${error}`
    return
  }
  if (!code) {
    message.value = 'Code de validation manquant.'
    return
  }
  try {
    await auth.handleOAuthCallback(String(code))
    router.replace({ name: 'home' })
  } catch (e) {
    message.value = `Échec de l’authentification: ${e?.message || e}`
  }
})
</script>

<template>
  <section class="container">
    <p>{{ message }}</p>
  </section>
</template>
