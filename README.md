# Streeming App (Web + Mobile + Desktop)

Кросплатформенна платформа для стрімінгу ігор: backend на Fastify (TS), вебклієнт на React/Vite, мобільний клієнт на Flutter, десктоп на Electron.

## Швидкий старт
1. Скопіюйте `.env.example` у `backend/.env` і заповніть секрети/БД.
2. Запустіть Postgres і (за бажанням) Redis.
3. Встановіть залежності: `pnpm install`.
4. Старт backend: `pnpm dev` (порт 4000).
5. Старт веб: `pnpm --filter web dev` (порт 5173).

## Структура
- `backend/` — API, auth, стріми, чат (WS), схеми БД.
- `clients/web/` — React/Vite клієнт із програвачем HLS і чатівкою.
- `clients/desktop/` — Electron оболонка для вебклієнта.
- `clients/mobile/` — Flutter додаток (базовий глядач).
- `packages/` — спільні пакети (зарезервовано).

## Архітектура
Детально: `docs/architecture.md`.
