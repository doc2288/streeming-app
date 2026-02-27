# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Streeming App is a cross-platform game streaming platform monorepo (Ukrainian UI). Key services:

| Service | Directory | Port | Start command |
|---------|-----------|------|---------------|
| Backend (Fastify API + WS chat) | `backend/` | 4000 | `pnpm dev` (root) or `pnpm --filter backend dev` |
| Web client (React/Vite) | `clients/web/` | 5173 | `pnpm --filter web dev` |
| Desktop (Electron) | `clients/desktop/` | — | Optional, wraps web client |
| Mobile (Flutter) | `clients/mobile/` | — | Optional, basic viewer |

### Prerequisites

- **Node.js 20** via nvm (`nvm use 20`). The CI uses Node 20.
- **pnpm 9.0.0** — the monorepo `packageManager` field specifies this.
- **PostgreSQL 16** must be running on localhost:5432.

### Database setup

PostgreSQL needs a `streeming` database and user. Backend auto-migrates tables on startup (`CREATE TABLE IF NOT EXISTS ...`). The `pgcrypto` extension is required.

```
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "CREATE USER streeming WITH PASSWORD 'streeming' SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE streeming OWNER streeming;"
```

### Backend .env

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL=postgresql://streeming:streeming@localhost:5432/streeming`. The example values for `JWT_SECRET` and `REFRESH_SECRET` work for development. `REDIS_URL` is optional (not used in current code).

### Running services

1. Start PostgreSQL: `sudo pg_ctlcluster 16 main start`
2. Start backend: `pnpm dev` (runs `tsx watch` on port 4000)
3. Start web client: `pnpm --filter web dev` (Vite on port 5173)

### Testing and linting

- **Tests**: `pnpm test` runs vitest across backend and web. Both are configured for `vitest run` (non-watch) mode.
- **Lint**: `pnpm lint` runs ESLint across backend and web. Both have pre-existing lint warnings from the strict `standard-with-typescript` config.
- See `package.json` scripts at root and in each workspace for all available commands.

### API endpoints

See `backend/README.md` for the full route list. Key additions from the audit:
- `POST /auth/logout` — invalidates refresh token
- `DELETE /streams/:id` — delete stream (owner/admin only)
- `GET /health` — now returns `{ status, db, uptime }`

### Known gotchas

- The original `backend/package.json` had several non-existent dependency versions (e.g., `@types/pino@^8.6.4`, `zod@^4.22.4`, and Fastify 5 plugins with Fastify 4). These were corrected to compatible versions.
- `@fastify/websocket` registers a request-level `ws` decorator; the guard in `chat.ts` uses `hasRequestDecorator('ws')` to avoid double-registration.
- The web client falls back to a public Mux test HLS stream (`test-streams.mux.dev`) when no real RTMP media server is running — this is expected for local dev.
