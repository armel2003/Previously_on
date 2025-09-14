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
