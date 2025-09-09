import bsConfig from '@/config/betaseries'

function toQuery(params) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, String(v))
  })
  return usp.toString()
}

export function buildAuthorizeUrl(state = '') {
  // Assumes OAuth2 Authorization Code flow
  const params = {
    client_id: bsConfig.apiKey,
    redirect_uri: bsConfig.redirectUri,
    response_type: 'code',
    scope: bsConfig.scope,
    state,
  }
  const base = bsConfig.authorizeUrl
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}${toQuery(params)}`
}

export async function exchangeCodeForToken(code) {
  // Public SPAs should use a backend for client_secret; here for demo only
  const res = await fetch(bsConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-BetaSeries-Version': bsConfig.apiVersion,
      'X-BetaSeries-Key': bsConfig.apiKey,
    },
    body: toQuery({
      grant_type: 'authorization_code',
      client_id: bsConfig.apiKey,
      client_secret: bsConfig.clientSecret,
      redirect_uri: bsConfig.redirectUri,
      code,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Token exchange failed (${res.status}): ${text}`)
  }
  return res.json()
}
