# betaseries

This template should help get you started developing with Vue 3 in Vite.

## OAuth BetaSeries (dev)

Environment variables (in `.env`):

- `VITE_BS_AUTH_URL` (default: https://www.betaseries.com)
- `VITE_BS_API_URL` (default: https://api.betaseries.com)
- `VITE_BS_API_KEY` (client_id)
- `VITE_BS_SECRET` (client_secret) — avoid in production frontend
- `VITE_BS_REDIRECT_URI` (e.g., http://localhost:5173/login)

In dev, ensure the Vite dev server runs on `5173` to match your redirect URI, or update the URI in BetaSeries app settings.

Login route: `/login`

Protected routes use `meta.requiresAuth`.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
