<template>
  <div class="films">
    <h1>Liste des Films</h1>
    <!-- Barre de recherche -->
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher un film..."
      class="search-bar"
    />
    <!-- Liste des films -->
    <div class="cards">
      <div v-for="film in filteredFilms" :key="film.id" class="card">
        <img :src="film.poster" alt="Affiche du film" />
        <h2>{{ film.title }}</h2>
        <!-- <p>Note : {{ film.notes?.mean ?? 'Non renseignée' }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const films = ref([]);
const search = ref("");

async function fetchFilms() {
  try {
  const res = await axios.get("https://api.betaseries.com/movies/list", {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      }
    });
    films.value = res.data.movies;
  } catch (err) {
    console.error(err);
  }
}

const filteredFilms = computed(() =>
  films.value.filter((f) =>
    f.title.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(fetchFilms);
</script>

<style scoped>
.search-bar {
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 400px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  border: 1px solid #ddd;
  padding: 10px;
  width: 200px;
  text-align: center;
}
.card img {
  max-width: 100%;
}
</style>
