<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="detail">
    <img :src="contentImage" alt="Affiche" class="poster" />
    <h1>{{ content.title }}</h1>
    <p>{{ content.description }}</p>

    <!-- Bouton Marquer comme vu -->
    <button @click="markAsWatched" class="btn">
      ✅ Marquer comme vu
    </button>

    <p v-if="message">{{ message }}</p>

    <div v-if="isMovie">
      <p>Durée : {{ content.duration }} minutes</p>
    </div>

    <div v-if="isShow">
      <p>Saisons : {{ content.seasons }}</p>
      <p>Épisodes : {{ content.episodes }}</p>
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
.btn {
  margin: 15px;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
.btn:hover {
  background: #45a049;
}
</style>
