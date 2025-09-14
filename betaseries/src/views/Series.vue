<template>
  <div class="series">
    <h1>Liste des Séries</h1>
    
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher une série..."
      class="search-bar"
    />
   
    <div class="cards">
      <router-link
        v-for="serie in filteredSeries"
        :key="serie.id"
        :to="`/detail/show/${serie.id}`"
        style="text-decoration: none; color: inherit;"
      >
        <div class="card">
          <img :src="serie.images.poster" alt="Affiche de la série" />
          <h2>{{ serie.title }}</h2>
          <p>Note : {{ serie.notes?.mean ?? 'N/A' }}</p>
          <p>Genre principal : {{ serie.genres?.[0] ?? 'N/A' }}</p>
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
const series = ref([]);
const search = ref("");

async function fetchSeries() {
  try {
    const res = await axios.get("https://api.betaseries.com/shows/list", {
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
    series.value = res.data.shows;
  } catch (err) {
    console.error(err);
  }
}

const filteredSeries = computed(() =>
  series.value.filter((s) =>
    s.title.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(fetchSeries);
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
  background: #9d9b9b91;
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
