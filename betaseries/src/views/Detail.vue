<template>
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="detail">
    <img :src="contentImage" alt="Affiche" class="poster" />
    <h1>{{ content.title }}</h1>
    <p>{{ content.description }}</p>
    <p v-if="isMovie">Durée : {{ content.duration }} minutes</p>
    <p v-if="content.genres && content.genres.length">Genres : {{ content.genres.join(', ') }}</p>
    <p v-if="content.note">Note : {{ content.note.mean ?? content.note }}</p>
    <p v-if="content.platforms && content.platforms.length">Plateformes : {{ content.platforms.map(p => p.name).join(', ') }}</p>

    <div v-if="isShow">
      <p>Saisons : {{ content.seasons }}</p>
      <p>Épisodes (total) : {{ episodesTotal }}</p>
      <div v-if="episodesBySeason && Object.keys(episodesBySeason).length">
        <h3>Épisodes par saison :</h3>
        <ul style="text-align:left;display:inline-block;">
          <li v-for="(count, season) in episodesBySeason" :key="season">
            Saison {{ season }} : {{ count }} épisode(s)
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
const episodesBySeason = ref({});
const episodesTotal = ref(0);
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const auth = useAuthStore();

const type = route.params.type; 
const id = route.params.id;

const content = ref({});
const loading = ref(true);
const error = ref(null);

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
    let params = {};
    if (isMovie.value) {
      params = {
        id: id,
        tmdb_id: route.query.tmdb_id || undefined,
        imdb_id: route.query.imdb_id || undefined,
        includes: "user,notes,platforms",
        locale: "fr"
      };
      url = `https://api.betaseries.com/movies/movie`;
    } else {
      params = {
        id: id,
        includes: "user,notes,platforms",
        locale: "fr"
      };
      url = `https://api.betaseries.com/shows/display`;
    }

    const res = await axios.get(url, {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`
      },
      params
    });

    if (isMovie.value) {
      content.value = res.data.movie;
    } else {
      content.value = res.data.show;
      // Appel API séparé pour les épisodes par saison
      try {
        const episodesRes = await axios.get("https://api.betaseries.com/shows/episodes", {
          headers: {
            "X-BetaSeries-Version": "3.0",
            "X-BetaSeries-Key": "1d6a0f0e056a",
            Authorization: `Bearer ${auth.token}`
          },
          params: {
            id: id,
            locale: "fr"
          }
        });
        // Regrouper les épisodes par saison
        const bySeason = {};
        let total = 0;
        for (const ep of episodesRes.data.episodes) {
          if (!bySeason[ep.season]) bySeason[ep.season] = 0;
          bySeason[ep.season]++;
          total++;
        }
        episodesBySeason.value = bySeason;
        episodesTotal.value = total;
      } catch (e) {
        episodesBySeason.value = {};
        episodesTotal.value = 0;
      }
    }
  } catch (err) {
    error.value = "Erreur lors du chargement.";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDetail);
</script>

<style scoped>
.detail {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
.poster {
  width: 300px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
 