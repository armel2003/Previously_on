## BetaSeries OAuth Demo (Vue 3 + Vite)

Setup
- Copy `.env.example` to `.env` and fill values:
	- VITE_BS_AUTHORIZE_URL=https://www.betaseries.com/authorize
	- VITE_BS_TOKEN_URL=https://api.betaseries.com/oauth/access_token
	- VITE_BS_CLIENT_ID=<your client id>
	- VITE_BS_SECRET=<your client secret> (avoid in SPA; use a backend or PKCE if available)
	- VITE_BS_REDIRECT_URI=http://localhost:5175/callback
	- VITE_BS_API_VERSION=3.0

Run
- npm install
- npm run dev
- Open http://localhost:5175

Flow
- Click Login, you’ll be redirected to BetaSeries. After consent, you’ll land on `/callback` where the code is exchanged for a token and stored in localStorage.

Notes
- For production, move token exchange to a backend or use PKCE if the provider supports it. The client_secret in a public SPA is not secure.
