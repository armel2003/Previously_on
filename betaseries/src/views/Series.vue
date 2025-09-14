<template>
  <div class="series">
    <div class="page-header">
      <h1>Explorez les séries</h1>
      <p class="page-subtitle">Découvrez des séries populaires et suivez vos préférées</p>
      
      <div class="search-container">
        <div class="search-icon">🔍</div>
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher une série par titre..."
          class="search-bar"
        />
      </div>
    </div>
    
    <div v-if="!series.length" class="loading">Chargement des séries</div>
   
    <div v-else class="cards">
      <router-link
        v-for="serie in filteredSeries"
        :key="serie.id"
        :to="`/detail/show/${serie.id}`"
      >
        <div class="card">
          <div class="card-image">
            <img :src="serie.images.poster || '/placeholder-poster.png'" alt="Affiche de la série" />
            <div class="card-rating" v-if="serie.notes?.mean">
              <span class="star">★</span> {{ parseFloat(serie.notes?.mean).toFixed(1) }}
            </div>
          </div>
          <div class="card-content">
            <h2>{{ serie.title }}</h2>
            <p class="card-genre">{{ serie.genres?.[0] ?? 'Genre inconnu' }}</p>
          </div>
        </div>
      </router-link>
    </div>
    
    <div v-if="filteredSeries.length === 0 && search.length > 0" class="no-results">
      <p>Aucune série trouvée pour "{{ search }}"</p>
      <button @click="search = ''" class="btn btn-secondary">Effacer la recherche</button>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-bar {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--bg-card-color);
  font-size: 1rem;
  transition: all var(--transition-speed) ease;
}

.search-bar:focus {
  box-shadow: 0 0 0 3px rgba(124, 77, 255, 0.2);
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  background: var(--bg-card-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--box-shadow);
}

.card-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-speed) ease;
}

.card-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star {
  color: gold;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card h2 {
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.card-genre {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.cards > a {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.cards > a:hover .card {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.cards > a:hover .card img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .card-image {
    height: 240px;
  }
}
</style>

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
