<template>
  <div class="callback">
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <h2>Connexion en cours...</h2>
      <p>Authentification avec BetaSeries, veuillez patienter</p>
    </div>
  </div>
</template>

<style scoped>
.callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.loading-container {
  padding: 3rem;
  border-radius: var(--border-radius);
  background: var(--bg-card-color);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(124, 77, 255, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

h2 {
  margin: 0;
  color: var(--text-primary);
}

p {
  margin: 0;
  color: var(--text-secondary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const CLIENT_ID = "1d6a0f0e056a";
const CLIENT_SECRET = "94bd46ed2181fb819d04886a520e7160";

const code = route.query.code;

if (code) {
  axios.post("https://api.betaseries.com/oauth/access_token", {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    redirect_uri: "http://localhost:5173/callback",
    grant_type: "authorization_code"
  })
  .then(res => {
    auth.setToken(res.data.access_token);
    router.push("/films"); 
  })
  .catch(err => console.error(err));
}
</script>
