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
          <div class="img-container">
            <img :src="serie.images.poster" alt="Affiche de la série" />
            <span class="genre-badge">{{ serie.genres?.[0] ?? 'N/A' }}</span>
          </div>
          <h2>{{ serie.title }}</h2>
          <div class="note">
            <span v-if="serie.notes?.mean">★ {{ serie.notes.mean.toFixed(1) }}</span>
            <span v-else>N/A</span>
          </div>
        </div>
      </router-link>
    </div>
    
    <div v-if="filteredSeries.length === 0 && search.length > 0" class="no-results">
      <p>Aucune série trouvée pour "{{ search }}"</p>
      <button @click="search = ''" class="btn btn-secondary">Effacer la recherche</button>
    </div>
    
    <!-- Pagination -->
    <div v-if="filteredSeries.length > 0 && !search.length" class="pagination">
      <button 
        class="pagination-btn" 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
      >
        &laquo;
      </button>
      
      <button 
        class="pagination-btn" 
        @click="currentPage--" 
        :disabled="currentPage === 1"
      >
        &lsaquo;
      </button>
      
      <template v-for="pageNumber in displayedPageNumbers" :key="pageNumber">
        <button 
          v-if="pageNumber !== '...'" 
          class="pagination-btn" 
          :class="{ active: currentPage === pageNumber }"
          @click="currentPage = pageNumber"
        >
          {{ pageNumber }}
        </button>
        <span v-else class="pagination-ellipsis">...</span>
      </template>
      
      <button 
        class="pagination-btn" 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
      >
        &rsaquo;
      </button>
      
      <button 
        class="pagination-btn" 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
      >
        &raquo;
      </button>
      
      <div class="pagination-info">
        Page {{ currentPage }} sur {{ totalPages }}
      </div>
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
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const series = ref([]);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(20); // Nombre de séries par page

// Fonction pour récupérer toutes les séries (nous les paginerons côté client)
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
        locale: 'fr',
        extended: 'full' // Pour obtenir plus de détails
      }
    });
    series.value = res.data.shows;
  } catch (err) {
    console.error(err);
  }
}

// Filtrer les séries en fonction de la recherche
const filteredSeries = computed(() => {
  const filtered = series.value.filter((s) =>
    s.title.toLowerCase().includes(search.value.toLowerCase())
  );
  
  // Si une recherche est en cours, renvoyer tous les résultats filtrés
  if (search.value) {
    return filtered;
  }
  
  // Sinon, paginer les résultats
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.slice(start, end);
});

// Calculer le nombre total de pages
const totalPages = computed(() => {
  if (search.value) return 1;
  return Math.ceil(series.value.length / itemsPerPage.value);
});

// Générer les numéros de page à afficher
const displayedPageNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    // Si moins de 7 pages, afficher toutes les pages
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  // Sinon, afficher une partie des pages avec des ellipses
  if (current <= 3) {
    return [1, 2, 3, 4, 5, '...', total];
  } else if (current >= total - 2) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  } else {
    return [1, '...', current - 1, current, current + 1, '...', total];
  }
});

// Réinitialiser la page actuelle lors d'une nouvelle recherche
watch(search, () => {
  currentPage.value = 1;
});

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
/* Nouvelle carte améliorée */
.card {
  border: none;
  box-shadow: 0 2px 12px rgba(38,47,177,0.10), 0 1.5px 6px rgba(0,0,0,0.08);
  padding: 0 0 16px 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.cards > a:hover .card {
  box-shadow: 0 8px 32px rgba(38,47,177,0.18), 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-6px) scale(1.04);
}
.img-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.card img {
  max-width: 90%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.genre-badge {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: #262fb1;
  color: #fff;
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(38,47,177,0.10);
}
.card h2 {
  font-size: 1.08rem;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
  font-weight: 600;
  color: #262fb1;
}
.note {
  font-size: 1.05rem;
  color: #f5b301;
  font-weight: 600;
  margin-bottom: 0;
}
@media (max-width: 600px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }
  .cards > a {
    width: 95vw;
    min-width: unset;
    max-width: unset;
    height: auto;
    min-height: unset;
    max-height: unset;
  }
  .card img {
    max-width: 98vw;
    max-height: 40vw;
  }
}
</style>
