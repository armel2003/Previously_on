// Lightweight OAuth helpers for BetaSeries
// Endpoints inferred from community provider and env config

import axios from 'axios'

const AUTH_BASE = import.meta.env.VITE_BS_AUTH_URL?.replace(/\/?$/, '') || 'https://www.betaseries.com'
const API_BASE = import.meta.env.VITE_BS_API_URL?.replace(/\/?$/, '') || 'https://api.betaseries.com'
const CLIENT_ID = import.meta.env.VITE_BS_API_KEY
const REDIRECT_URI = import.meta.env.VITE_BS_REDIRECT_URI
const CLIENT_SECRET = import.meta.env.VITE_BS_SECRET // Note: avoid exposing secrets in frontend in production

// Axios instance configured for BetaSeries
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-BetaSeries-Key': CLIENT_ID,
  },
})

export function buildAuthorizationUrl(state = '') {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
  })
  if (state) params.set('state', state)
  // BetaSeries authorize endpoint
  return `${AUTH_BASE}/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code) {
  // Exchange code for access token
  // Endpoint: POST /members/access_token
  const body = new URLSearchParams({
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  })
  // Some implementations require client_secret; include if available
  if (CLIENT_SECRET) body.set('client_secret', CLIENT_SECRET)
  try {
    const { data } = await api.post('/members/access_token', body)
    // Expected shape: { token: '...', ... }
    return data
  } catch (err) {
    // Normalize error
    const message = err?.response?.data?.error || err?.message || 'Token exchange failed'
    throw new Error(message)
  }
}

export async function fetchUserInfos(accessToken) {
  try {
    const { data } = await api.get('/members/infos', {
      headers: {
        'X-BetaSeries-Token': accessToken,
      },
    })
    return data?.member || null
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || 'Failed to fetch user infos'
    throw new Error(message)
  }
}
