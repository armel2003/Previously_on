import { defineStore } from 'pinia'
import { buildAuthorizationUrl, exchangeCodeForToken, fetchUserInfos } from '../services/auth'

const STORAGE_KEY = 'bs_auth'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: null, user: null }
  } catch {
    return { token: null, user: null }
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: state.token, user: state.user }))
  } catch {
    // ignore persistence errors in private mode or blocked storage
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: loadPersisted().token,
    user: loadPersisted().user,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    login() {
      // Optionally pass a CSRF state
      const state = Math.random().toString(36).slice(2)
      sessionStorage.setItem('oauth_state', state)
      window.location.href = buildAuthorizationUrl(state)
    },
    async handleOAuthCallback(query) {
      const { code, state } = query
      const expected = sessionStorage.getItem('oauth_state')
      if (expected && state && state !== expected) {
        this.error = 'Invalid OAuth state'
        return false
      }
      if (!code) {
        this.error = 'Missing authorization code'
        return false
      }
      this.loading = true
      this.error = null
      try {
        const tokenResp = await exchangeCodeForToken(code)
        const accessToken = tokenResp?.token || tokenResp?.access_token
        this.token = accessToken
        const user = await fetchUserInfos(accessToken)
        this.user = user
        persist(this)
        return true
      } catch (e) {
        this.error = e.message
        this.token = null
        this.user = null
        persist(this)
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = null
      this.user = null
      persist(this)
    },
  },
})
