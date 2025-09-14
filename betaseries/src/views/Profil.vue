<template>
  <div class="profil">
    <h1>Mon Profil</h1>

    <h2>🎬 Films vus</h2>
    <ul>
      <li v-for="film in films" :key="film.id">
        {{ film.title }} ({{ film.production_year }})
      </li>
    </ul>

    <h2>📺 Séries suivies</h2>
    <ul>
      <li v-for="serie in series" :key="serie.id">
        {{ serie.title }} - 
        Progression : {{ serie.user.seen }} / {{ serie.episodes }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const films = ref([]);
const series = ref([]);

async function fetchProfil() {
  try {
    const resMovies = await axios.get("https://api.betaseries.com/movies/member", {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      }
    });
    films.value = resMovies.data.movies;

    const resSeries = await axios.get("https://api.betaseries.com/shows/member", {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      }
    });
    series.value = resSeries.data.shows;
  } catch (err) {
    console.error(err);
  }
}

onMounted(fetchProfil);
</script>
