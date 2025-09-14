<template>
  <div class="profil-ami">
    <h1>Profil de {{ ami?.login }}</h1>

    <div v-if="ami">
      <h2>🎬 Films vus</h2>
      <ul>
        <li v-for="film in ami.movies" :key="film.id">
          {{ film.title }}
        </li>
      </ul>

      <h2>📺 Séries suivies</h2>
      <ul>
        <li v-for="serie in ami.shows" :key="serie.id">
          {{ serie.title }} - Progression : 
          {{ serie.user.seen }} / {{ serie.episodes }}
        </li>
      </ul>
    </div>
    <p v-else>Chargement...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const auth = useAuthStore();
const ami = ref(null);

async function fetchProfilAmi() {
  try {
    const res = await axios.get(
      `https://api.betaseries.com/members/infos?id=${route.params.id}`,
      {
        headers: {
          "X-BetaSeries-Version": "3.0",
          "X-BetaSeries-Key": "1d6a0f0e056a",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    ami.value = res.data.member;
  } catch (err) {
    console.error(err);
  }
}

onMounted(fetchProfilAmi);
</script>
