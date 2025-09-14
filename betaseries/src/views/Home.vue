<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
const auth = useAuthStore()
const { isAuthenticated } = storeToRefs(auth)
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="hero-content">
        <h1>Bienvenue sur Previously</h1>
        <p class="hero-tagline">Suivez, découvrez et partagez vos séries et films préférés</p>
        
        <div v-if="!isAuthenticated" class="cta-container">
          <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
          <RouterLink to="/login" class="btn">Se connecter</RouterLink>
        </div>
        
        <div v-else class="welcome-container">
          <p class="welcome-message">Vous êtes connecté ! Explorez notre catalogue et retrouvez vos favoris.</p>
          <div class="action-buttons">
            <RouterLink to="/series" class="btn">Parcourir les séries</RouterLink>
            <RouterLink to="/films" class="btn btn-secondary">Découvrir les films</RouterLink>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">📺</div>
        <h3>Suivez vos séries</h3>
        <p>Gardez une trace des épisodes que vous avez regardés et ne manquez jamais la suite</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🍿</div>
        <h3>Découvrez des films</h3>
        <p>Explorez notre vaste catalogue de films et trouvez votre prochain coup de cœur</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">👥</div>
        <h3>Partagez avec vos amis</h3>
        <p>Retrouvez vos amis et partagez vos recommandations et critiques</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  padding: 3rem 0;
  text-align: center;
  border-radius: var(--border-radius);
  background: linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(0, 200, 255, 0.1));
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-tagline {
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: var(--text-secondary);
}

.cta-container, .welcome-container {
  margin-top: 2rem;
}

.cta-container p, .welcome-message {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.welcome-message {
  color: var(--success-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-secondary:hover {
  background: rgba(124, 77, 255, 0.1);
  color: var(--primary-color-light);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--bg-card-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  box-shadow: var(--box-shadow);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-tagline {
    font-size: 1.2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
