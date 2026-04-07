# SnabbMat Recipe Proxy

Tiny backend proxy for ICA recipe search.

## Setup

1. Copy `.env.example` to `.env` and set `ICA_BEARER_TOKEN`.
2. Start the proxy:

```bash
cd backend
node --env-file=.env server.js
```

The proxy runs on `http://localhost:8787`.

## Endpoint

- `GET /api/recipes/page-and-filters?url=%2Flax%2F&take=23&onlyEnabled=true`

Use `EXPO_PUBLIC_RECIPE_PROXY_URL` in the app if backend runs on another host/port.

## Build local recipe database

You can generate a local ICA recipe database used directly by the app:

```bash
npm run recipes:sync
```

Optional limit:

```bash
MAX_RECIPES=500 npm run recipes:sync
```

This writes to `src/data/icaRecipeDatabase.json`.
