<template>
  <div class="amis">
    <h1>👥 Mes amis</h1>

    <!-- Ajout d’un ami -->
    <input v-model="newFriend" placeholder="ID ou pseudo de l’ami" />
    <button @click="addFriend">Ajouter</button>

    <ul>
      <li v-for="ami in amis" :key="ami.id">
        <router-link :to="`/profil-ami/${ami.id}`">
          {{ ami.login }}
        </router-link>
        <button @click="removeFriend(ami.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const amis = ref([]);
const newFriend = ref("");

async function fetchAmis() {
  try {
    const res = await axios.get("https://api.betaseries.com/friends/list", {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    amis.value = res.data.users;
  } catch (err) {
    console.error(err);
  }
}

async function addFriend() {
  try {
    await axios.post(
      "https://api.betaseries.com/friends/friend",
      { id: newFriend.value },
      {
        headers: {
          "X-BetaSeries-Version": "3.0",
          "X-BetaSeries-Key": "1d6a0f0e056a",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    fetchAmis();
    newFriend.value = "";
  } catch (err) {
    console.error(err);
  }
}

async function removeFriend(id) {
  try {
    await axios.delete("https://api.betaseries.com/friends/friend", {
      headers: {
        "X-BetaSeries-Version": "3.0",
        "X-BetaSeries-Key": "1d6a0f0e056a",
        Authorization: `Bearer ${auth.token}`,
      },
      data: { id },
    });
    fetchAmis();
  } catch (err) {
    console.error(err);
  }
}

onMounted(fetchAmis);
</script>
