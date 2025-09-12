<template>
  <div>
    <h2>Connexion en cours...</h2>
  </div>
</template>

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
