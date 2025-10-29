<template>
  <div class="films">
    <div class="page-header">
      <h1>Explorez les films</h1>
      <p class="page-subtitle">Découvrez des films populaires et élargissez votre cinématographie</p>
      
      <div class="search-container">
        <div class="search-icon">🔍</div>
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher un film par titre..."
          class="search-bar"
        />
      </div>
    </div>
    
    <div v-if="!films.length" class="loading">Chargement des films</div>
   
    <div v-else class="cards">
      <router-link
        v-for="film in filteredFilms"
        :key="film.id"
        :to="`/detail/movie/${film.id}`"
      >
        <div class="card">
          <div class="img-container">
            <img :src="film.poster || '/default-poster.png'" alt="Affiche du film" />
            <span class="genre-badge">{{ film.genres?.[0] ?? 'N/A' }}</span>
            <span class="note-badge">
              <span v-if="film.note?.mean">★ {{ film.note.mean.toFixed(1) }}</span>
              <span v-else>N/A</span>
            </span>
          </div>
          <h2 class="card-title">{{ film.title ?? 'Titre non renseigné' }}</h2>
        </div>
      </router-link>
    </div>
    
    <div v-if="filteredFilms.length === 0 && search.length > 0" class="no-results">
      <p>Aucun film trouvé pour "{{ search }}"</p>
      <button @click="search = ''" class="btn btn-secondary">Effacer la recherche</button>
    </div>
    
    <!-- Pagination -->
    <div v-if="filteredFilms.length > 0 && !search.length" class="pagination">
      <button 
        class="pagination-btn" 
        @click="currentPage = 2" 
        :disabled="currentPage === 2"
      >
        &laquo;
      </button>
      
      <button 
        class="pagination-btn" 
        @click="currentPage--" 
        :disabled="currentPage === 2"
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
const films = ref([]);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(20); // Nombre de films par page

// Fonction pour récupérer tous les films (nous les paginerons côté client)
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
        locale: 'fr',
        extended: 'full' // Pour obtenir plus de détails, y compris les notes
      }
    });
    films.value = res.data.movies;
    
    // Correction du problème des notes - remplacer 'note' par 'notes' si nécessaire
    films.value = films.value.map(film => {
      if (film.note && !film.notes) {
        film.notes = film.note;
      }
      return film;
    });
  } catch (err) {
    console.error(err);
  }
}

// Filtrer les films en fonction de la recherche
const filteredFilms = computed(() => {
  const filtered = films.value.filter((f) =>
    f.title.toLowerCase().includes(search.value.toLowerCase())
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
  return Math.ceil(films.value.length / itemsPerPage.value);
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

/* Nouvelle carte améliorée */

.card {
  border: none;
  box-shadow: 0 4px 24px rgba(38,47,177,0.13), 0 2px 8px rgba(0,0,0,0.10);
  padding: 0 0 18px 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  background: linear-gradient(135deg, #f8faff 60%, #e6eaff 100%);
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition: box-shadow 0.25s, transform 0.22s;
  position: relative;
  overflow: hidden;
  animation: fadeInCard 0.7s cubic-bezier(.4,0,.2,1);
}
.cards > a:hover .card {
  box-shadow: 0 12px 40px rgba(38,47,177,0.22), 0 8px 32px rgba(0,0,0,0.16);
  transform: translateY(-10px) scale(1.06);
}
@keyframes fadeInCard {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.img-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}
.card img {
  max-width: 92%;
  max-height: 210px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.13);
  border: 3px solid #fff;
  background: #e6eaff;
}
.genre-badge {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #262fb1 60%, #4e5ae8 100%);
  color: #fff;
  padding: 4px 16px;
  border-radius: 14px;
  font-size: 0.93rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(38,47,177,0.13);
  letter-spacing: 0.5px;
  border: 1.5px solid #fff;
}
.note-badge {
  position: absolute;
  top: 10px;
  right: 18px;
  background: #fff;
  color: #f5b301;
  font-size: 1.08rem;
  font-weight: 700;
  border-radius: 50px;
  padding: 4px 13px 4px 10px;
  box-shadow: 0 2px 8px rgba(245,179,1,0.10);
  border: 1.5px solid #f5b301;
  display: flex;
  align-items: center;
  gap: 2px;
}
.note-badge span {
  display: flex;
  align-items: center;
}
.card-title {
  font-size: 1.13rem;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 90%;
  font-weight: 700;
  color: #262fb1;
  line-height: 1.25;
  min-height: 2.3em;
}
@media (max-width: 600px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }
  .cards > a {
    width: 97vw;
    min-width: unset;
    max-width: unset;
    height: auto;
    min-height: unset;
    max-height: unset;
  }
  .card img {
    max-width: 99vw;
    max-height: 45vw;
  }
}
</style>
