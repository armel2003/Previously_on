<template>
  <div class="films">
    <h1>Liste des Films</h1>
    
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher un film..."
      class="search-bar"
    />
    
    <div class="cards">
      <router-link
        v-for="film in filteredFilms"
        :key="film.id"
        :to="`/detail/movie/${film.id}`"
        style="text-decoration: none; color: inherit;"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const films = ref([]);
const search = ref("");

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
        locale: 'fr'
      }
    });
    films.value = res.data.movies;
  } catch (err) {
    console.error(err);
  }
}

const filteredFilms = computed(() =>
  films.value.filter((f) =>
    f.title.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(fetchFilms);
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
