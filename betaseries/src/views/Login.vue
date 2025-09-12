<template>
  <div class="login">
    <h1>Connexion à BetaSeries</h1>
    <button @click="login">Se connecter</button>
  </div>
</template>

<script setup>
const CLIENT_ID = "1d6a0f0e056a"; 
const REDIRECT_URI = "http://localhost:5173/callback"; 

function login() {
  window.location.href = `https://www.betaseries.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}
</script>
