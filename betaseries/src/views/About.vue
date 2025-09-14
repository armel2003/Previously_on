<template>
  <section class="about">
    <div class="about-header">
      <h1>À propos de Previously</h1>
      <p class="about-subtitle">Découvrez l'histoire et les fonctionnalités de notre application</p>
    </div>
    
    <div class="about-content">
      <div class="about-section">
        <h2>Notre mission</h2>
        <p>
          Previously est une application qui vous permet de suivre facilement vos séries et films préférés.
          Notre objectif est de vous offrir une expérience utilisateur fluide et agréable pour gérer votre contenu audiovisuel.
        </p>
      </div>
      
      <div class="about-section">
        <h2>Fonctionnalités</h2>
        <ul class="feature-list">
          <li>
            <span class="feature-icon">📺</span>
            <div>
              <h3>Suivi de séries</h3>
              <p>Gardez une trace des épisodes que vous avez regardés et ne manquez jamais la suite</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">🍿</span>
            <div>
              <h3>Collection de films</h3>
              <p>Ajoutez des films à votre collection et notez ceux que vous avez vus</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">👥</span>
            <div>
              <h3>Réseau social</h3>
              <p>Suivez vos amis et partagez vos recommandations</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">🔔</span>
            <div>
              <h3>Notifications</h3>
              <p>Recevez des alertes pour les nouveaux épisodes de vos séries préférées</p>
            </div>
          </li>
        </ul>
      </div>
      
      <div class="about-section">
        <h2>Technologies</h2>
        <div class="tech-stack">
          <div class="tech-item">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="Vue.js" />
            <span>Vue.js</span>
          </div>
          <div class="tech-item">
            <img src="https://pinia.vuejs.org/logo.svg" alt="Pinia" />
            <span>Pinia</span>
          </div>
          <div class="tech-item">
            <img src="https://vitejs.dev/logo.svg" alt="Vite" />
            <span>Vite</span>
          </div>
          <div class="tech-item">
            <img src="https://avatars.githubusercontent.com/u/6128107?s=200&v=4" alt="BetaSeries API" />
            <span>BetaSeries API</span>
          </div>
        </div>
      </div>
      
      <div class="about-section">
        <h2>Contact</h2>
        <p>
          Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter à
          <a href="mailto:contact@previously.com">contact@previously.com</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 2rem 0;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--bg-card-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.about-section h2 {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.about-section h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
}

.feature-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-list li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 2rem;
  background: rgba(124, 77, 255, 0.1);
  color: var(--primary-color);
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.feature-list h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.feature-list p {
  margin: 0;
  color: var(--text-secondary);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.tech-item img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.tech-item span {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color);
  transition: all var(--transition-speed) ease;
}

a:hover {
  color: var(--primary-color-light);
  border-bottom-style: solid;
}

@media (max-width: 768px) {
  .about-section {
    padding: 1.5rem;
  }
  
  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}
</style>
