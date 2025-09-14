<template>
  <div class="films">
    <h1>Liste des Films</h1>
    
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher un film..."
      class="search-bar"
    />
    
    <div class="cards">
      <router-link
        v-for="film in filteredFilms"
        :key="film.id"
        :to="`/detail/movie/${film.id}`"
        style="text-decoration: none; color: inherit;"
      >
        <div class="card">
          <img :src="film.poster || '/default-poster.png'" alt="Affiche du film" />
          <h2>{{ film.title ?? 'Titre non renseigné' }}</h2>
          <p>Note : {{ film.note?.mean ?? 'N/A' }}</p>
          <p>Genre principal : {{ film.genres?.[0] ?? 'N/A' }}</p>
        </div>
      </router-link>
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
      },
      params: {
        limit: 100,
        order: 'popularity',
        locale: 'fr'
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


.cards > a {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  height: 340px;
  min-height: 340px;
  max-height: 340px;
}

.card {
  border: 1px solid #ddd;
  padding: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
  background: #262fb14c;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.card img {
  max-width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}
.card h2 {
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.cards > a:hover .card {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-4px) scale(1.03);
}
</style>
