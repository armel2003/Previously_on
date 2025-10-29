<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
function logout() {
  auth.logout()
}
</script>

<template>
  <header>
    <nav class="container">
      <div class="nav-logo">
        <RouterLink to="/">Previously</RouterLink>
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/series">Séries</RouterLink>
        <RouterLink to="/films">Films</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/profil">Profil</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/amis">Amis</RouterLink>
      </div>
      <div class="nav-auth">
        <RouterLink v-if="!isAuthenticated" to="/login" class="btn-login">Connexion</RouterLink>
        <button v-else @click="logout" class="btn-logout">Déconnexion</button>
      </div>
    </nav>
  </header>
  <main class="container">
    <RouterView />
  </main>
  <footer>
    <div class="container">
      <p>&copy; 2025 Previously - Une application BetaSeries</p>
    </div>
  </footer>
</template>

<style scoped>
.nav-logo a {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.btn-login {
  color: var(--text-primary);
  padding: 0.5rem 1.2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
  transition: all var(--transition-speed) ease;
}

.btn-login:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-logout {
  background: transparent;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  box-shadow: none;
}

.btn-logout:hover {
  background: rgba(255, 82, 82, 0.1);
  color: var(--error-color);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(255, 82, 82, 0.2);
}

footer {
  margin-top: 3rem;
  padding: 1.5rem 0;
  background-color: var(--bg-color-light);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

footer p {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-auth {
    order: 2;
  }
}
</style>

