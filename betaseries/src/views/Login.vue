<template>
  <div class="login">
    <div class="login-card">
      <div class="login-header">
        <h1>Connexion à BetaSeries</h1>
        <p class="login-subtitle">Connectez-vous pour suivre vos séries et films préférés</p>
      </div>
      
      <div class="login-body">
        <div class="login-info">
          <div class="info-item">
            <div class="info-icon">🔒</div>
            <p>Connexion sécurisée via BetaSeries</p>
          </div>
          <div class="info-item">
            <div class="info-icon">📱</div>
            <p>Synchronisez vos données sur tous vos appareils</p>
          </div>
          <div class="info-item">
            <div class="info-icon">👥</div>
            <p>Retrouvez vos amis et partagez vos découvertes</p>
          </div>
        </div>
        
        <button @click="login" class="login-button">
          <span>Se connecter avec BetaSeries</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 600px;
  background: var(--bg-card-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.login-header {
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.login-subtitle {
  color: var(--text-secondary);
  margin-bottom: 0;
}

.login-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.login-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  background: rgba(124, 77, 255, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-item p {
  margin: 0;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(to right, var(--primary-color), var(--primary-color-dark));
  border-radius: var(--border-radius);
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(124, 77, 255, 0.4);
}

.login-button:active {
  transform: translateY(-1px);
}

.login-button svg {
  transition: transform 0.3s ease;
}

.login-button:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .login-card {
    margin: 0 1rem;
  }
  
  .login-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .login-body {
    padding: 1.5rem;
  }
}
</style>

<script setup>
const CLIENT_ID = "1d6a0f0e056a"; 
const REDIRECT_URI = "http://localhost:5173/callback"; 

function login() {
  window.location.href = `https://www.betaseries.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}
</script>
