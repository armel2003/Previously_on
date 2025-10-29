<template>
  <div v-if="loading" class="loading">Chargement des détails</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else class="detail-container">
    <div class="detail-header">
      <h1>{{ content.title }}</h1>
      <p v-if="message" class="message" :class="{ success: message.includes('✅'), error: message.includes('❌') }">
        {{ message }}
      </p>
    </div>
    
    <div class="detail">
      <div class="detail-poster">
        <img :src="contentImage" :alt="`Affiche de ${content.title}`" class="poster" />
      </div>
      
      <div class="detail-content">
        <div class="detail-meta">
          <div class="meta-item" v-if="isMovie">
            <span class="meta-label">Durée</span>
            <span class="meta-value">{{ content.duration }} minutes</span>
          </div>
          
          <div class="meta-item" v-if="isShow">
            <span class="meta-label">Saisons</span>
            <span class="meta-value">{{ content.seasons }}</span>
          </div>
          
          <div class="meta-item" v-if="isShow">
            <span class="meta-label">Épisodes</span>
            <span class="meta-value">{{ content.episodes }}</span>
          </div>
          
          <div class="meta-item" v-if="content.notes?.mean">
            <span class="meta-label">Note</span>
            <span class="meta-value rating">
              {{ parseFloat(content.notes?.mean).toFixed(1) }} 
              <span class="star">★</span>
            </span>
          </div>
          
          <div class="meta-item" v-if="content.genres && content.genres.length">
            <span class="meta-label">Genres</span>
            <div class="meta-value">
              <span class="genre-tag" v-for="(genre, index) in content.genres" :key="index">
                {{ genre }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="detail-description">
          <h3>Synopsis</h3>
          <p>{{ content.description || "Aucune description disponible" }}</p>
        </div>
        
        <div class="detail-actions">
          <button @click="markAsWatched" class="btn btn-success watch-btn">
            <span class="icon">✅</span> Marquer comme vu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const auth = useAuthStore();

const type = route.params.type; // "movie" ou "show"
const id = route.params.id;

const content = ref({});
const loading = ref(true);
const error = ref(null);
const message = ref("");

const isMovie = computed(() => type === "movie");
const isShow = computed(() => type === "show");

const contentImage = computed(() => {
  if (isMovie.value) return content.value.poster;
  if (isShow.value) return content.value.images?.poster;
  return "";
});

async function fetchDetail() {
  try {
    let url = "";
    if (isMovie.value) {
      url = `https://api.betaseries.com/movies/movie?id=${id}`;
    } else {
      url = `https://api.betaseries.com/shows/display?id=${id}`;
    }

    const res = await axios.get(url, {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      }
    });

    if (isMovie.value) {
      content.value = res.data.movie;
    } else {
      content.value = res.data.show;
    }
  } catch (err) {
    error.value = "Erreur lors du chargement.";
  } finally {
    loading.value = false;
  }
}

async function markAsWatched() {
  try {
    let url = "";
    let data = {};

    if (isMovie.value) {
      url = `https://api.betaseries.com/movies/movie`;
      data = { id, watched: 1 };
    } else {
      // Exemple simple : on marque la série entière comme vue
      url = `https://api.betaseries.com/shows/show`;
      data = { id, show: id, status: "completed" };
    }

    await axios.post(url, data, {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      }
    });

    message.value = "✅ Contenu marqué comme vu !";
  } catch (err) {
    console.error(err);
    message.value = "❌ Erreur lors du marquage.";
  }
}

onMounted(fetchDetail);
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-header {
  text-align: center;
  margin-bottom: 1rem;
}

.detail {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  background: var(--bg-card-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.detail-poster {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.detail-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star {
  color: gold;
}

.genre-tag {
  display: inline-block;
  background: rgba(124, 77, 255, 0.1);
  color: var(--primary-color);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-description h3 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.detail-description p {
  line-height: 1.7;
  color: var(--text-secondary);
}

.detail-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.watch-btn {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--success-color);
}

.watch-btn:hover {
  background: #3d8b40;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: 0.7em 1.5em;
  transition: all var(--transition-speed) ease;
  font-weight: 500;
}

.btn-secondary:hover {
  background: rgba(124, 77, 255, 0.1);
  transform: translateY(-2px);
}

.icon {
  display: inline-block;
  font-size: 1.1em;
}

.message {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  display: inline-block;
  margin-top: 1rem;
  animation: fadeIn 0.5s ease;
}

.message.success {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
  border-left: 3px solid var(--success-color);
}

.message.error {
  background: rgba(255, 82, 82, 0.1);
  color: var(--error-color);
  border-left: 3px solid var(--error-color);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .detail {
    grid-template-columns: 1fr;
  }
  
  .detail-poster {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .detail-content {
    padding: 1.5rem;
  }
}
</style>
