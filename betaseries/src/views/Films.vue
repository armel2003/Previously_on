
<template>
  <div class="films">
    <div class="page-header">
      <h1>Explorez les films</h1>
      <p class="page-subtitle">Découvrez des films populaires et élargissez votre cinématographie</p>
      <div class="search-container">
        <div class="search-icon">🔍</div>
        <input type="text" v-model="search" placeholder="Rechercher un film par titre..." class="search-bar" />
      </div>
    </div>

    <div v-if="!films.length" class="loading">Chargement des films…</div>

    <div v-else class="cards">
      <router-link v-for="film in filteredFilms" :key="film.id" :to="`/detail/movie/${film.id}`">
        <div class="card">
          <div class="img-container">
            <img :src="film.poster || '/default-poster.png'" alt="Affiche du film" loading="lazy" decoding="async" />
            <span class="genre-badge">{{ film.genres?.[0] ?? 'N/A' }}</span>
            <span class="note-badge"><span v-if="film.note?.mean">★ {{ film.note.mean.toFixed(1) }}</span><span v-else>N/A</span></span>
          </div>
          <h2 class="card-title">{{ film.title ?? 'Titre non renseigné' }}</h2>
        </div>
      </router-link>
    </div>

    <div v-if="filteredFilms.length === 0 && search.length > 0" class="no-results">
      <p>Aucun film trouvé pour "{{ search }}"</p>
      <button @click="search = ''" class="btn btn-secondary">Effacer la recherche</button>
    </div>

    <div v-if="filteredFilms.length > 0 && !search.length" class="pagination">
      <button class="pagination-btn" @click="currentPage = 1" :disabled="currentPage === 1">&laquo;</button>
      <button class="pagination-btn" @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1">&lsaquo;</button>

      <template v-for="pageNumber in displayedPageNumbers" :key="pageNumber">
        <button v-if="pageNumber !== '...'" class="pagination-btn" :class="{ active: currentPage === pageNumber }" @click="currentPage = pageNumber">{{ pageNumber }}</button>
        <span v-else class="pagination-ellipsis">...</span>
      </template>

      <button class="pagination-btn" @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages">&rsaquo;</button>
      <button class="pagination-btn" @click="currentPage = totalPages" :disabled="currentPage === totalPages">&raquo;</button>

      <div class="pagination-info">Page {{ currentPage }} sur {{ totalPages }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const films = ref([]);
const search = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(20);

async function fetchFilms() {
  try {
    const cacheKey = 'films_cache_v1';
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.expires && parsed.expires > Date.now() && Array.isArray(parsed.movies)) {
          films.value = parsed.movies;
          return;
        }
      } catch (e) {
        // parsing failed — continue to fetch
        console.warn('films cache parse failed', e);
      }
    }

    const res = await axios.get('https://api.betaseries.com/movies/list', {
      headers: {
        'X-BetaSeries-Version': '3.0',
        'X-BetaSeries-Key': '1d6a0f0e056a',
        Authorization: `Bearer ${auth.token}`,
      },
      params: { limit: 60, order: 'popularity', locale: 'fr', extended: 'full' },
    });

    films.value = res.data.movies || [];

    try {
      const payload = { movies: films.value, expires: Date.now() + 15 * 60 * 1000 };
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch (e) {
      // ignore storage quota errors
    }
  } catch (err) {
    console.error(err);
  }
}

const filteredFilms = computed(() => {
  const q = search.value?.trim().toLowerCase() || '';
  const filtered = films.value.filter((f) => (f.title || '').toLowerCase().includes(q));
  if (q) return filtered;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filtered.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => (search.value ? 1 : Math.max(1, Math.ceil(films.value.length / itemsPerPage.value))));

const displayedPageNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 2) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
});

watch(search, () => {
  currentPage.value = 1;
});

onMounted(() => {
  if (!films.value.length) fetchFilms();
});
</script>

<style scoped>
/* Page header */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}
.search-container {
  position: relative;
  max-width: 600px;
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
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--bg-card-color);
  font-size: 0.98rem;
  transition: box-shadow 180ms ease, transform 180ms ease;
}
.search-bar:focus {
  box-shadow: 0 0 0 6px rgba(124, 77, 255, 0.06);
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01)), var(--bg-card-color);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 220ms cubic-bezier(.2, .8, .2, 1), box-shadow 220ms ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(8, 10, 30, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.02);
}
.img-container {
  position: relative;
  height: 260px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.02));
}
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 320ms cubic-bezier(.2, .8, .2, 1);
}
.genre-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(38, 47, 177, 0.95);
  color: #fff;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(46, 53, 150, 0.08);
}
.note-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #fff;
  color: #f5b301;
  font-size: 0.95rem;
  font-weight: 800;
  border-radius: 999px;
  padding: 6px 10px;
  box-shadow: 0 6px 18px rgba(245, 179, 1, 0.08);
  border: 1px solid rgba(245, 179, 1, 0.06);
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-title {
  font-size: 1.03rem;
  margin: 10px 12px 12px 12px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.18;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cards > a {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}
.cards > a:hover .card {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 18px 50px rgba(25, 32, 102, 0.12);
}
.cards > a:hover .card img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  .img-container {
    height: 200px;
  }
}

</style>
