// Centralized BetaSeries config derived from Vite env vars with safe defaults
export const bsConfig = {
  apiUrl: import.meta.env.VITE_BS_API_URL || 'https://api.betaseries.com',
  authorizeUrl: import.meta.env.VITE_BS_AUTHORIZE_URL || 'https://www.betaseries.com/authorize',
  tokenUrl: import.meta.env.VITE_BS_TOKEN_URL || 'https://api.betaseries.com/oauth/access_token',
  apiKey:
    import.meta.env.VITE_BS_CLIENT_ID || import.meta.env.VITE_BS_API_KEY || '',
  apiVersion: import.meta.env.VITE_BS_API_VERSION || '3.0',
  clientSecret: import.meta.env.VITE_BS_SECRET || '',
  scope: import.meta.env.VITE_BS_SCOPE || '',
  get redirectUri() {
    // Prefer env override, else use runtime origin for dev ports
    return (
      import.meta.env.VITE_BS_REDIRECT_URI || `${window.location.origin}/callback`
    )
  },
}

export default bsConfig
