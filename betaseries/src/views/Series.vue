<template>
  <div class="series">
    <h1>Liste des Séries</h1>
    <!-- Barre de recherche -->
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher une série..."
      class="search-bar"
    />
    <!-- Liste des séries -->
    <div class="cards">
      <div v-for="serie in filteredSeries" :key="serie.id" class="card">
        <img :src="serie.images.poster" alt="Affiche de la série" />
        <h2>{{ serie.title }}</h2>
        <p>Note : {{ serie.notes.mean }}</p>
        <p>Genre : {{ serie.genres[0] || 'Non renseigné' }}</p>
      </div>
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
