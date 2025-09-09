import { defineStore } from 'pinia'
import { exchangeCodeForToken } from '@/services/authService'

const TOKEN_KEY = 'bs_access_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    setToken(token) {
      this.accessToken = token
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    }
    ,
    logout() {
      this.setToken(null)
      this.user = null
    },
    async handleOAuthCallback(code) {
      this.loading = true
      this.error = null
      try {
        const data = await exchangeCodeForToken(code)
        const token = data.access_token || data.token || data.oauth_token || null
        if (!token) throw new Error('Aucun token retourné')
        this.setToken(token)
        return token
      } catch (e) {
        this.error = e.message || String(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
