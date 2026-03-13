# Streeming App (Web + Mobile + Desktop)

Кросплатформенна платформа для стрімінгу ігор: backend на Fastify (TS), вебклієнт на React/Vite, мобільний клієнт на Flutter, десктоп на Electron.

## Швидкий старт
1. Скопіюйте `.env.example` у `backend/.env` і заповніть секрети/БД.
2. Створіть `clients/web/.env` із:
   - `VITE_API_URL=http://localhost:4000`
   - `VITE_MEDIA_SERVER_URL=http://localhost:8080` (або ваш ngrok/public URL)
3. Запустіть Postgres і (за бажанням) Redis.
4. Встановіть залежності: `pnpm install`.
5. Старт backend: `pnpm dev` (порт 4000).
6. Старт веб: `pnpm --filter web dev` (порт 5173).

## Структура
- `backend/` — API, auth, стріми, чат (WS), схеми БД.
- `clients/web/` — React/Vite клієнт із програвачем HLS і чатівкою.
- `clients/desktop/` — Electron оболонка для вебклієнта.
- `clients/mobile/` — Flutter додаток (базовий глядач).
- `packages/` — спільні пакети (зарезервовано).

## Архітектура
Детально: `docs/architecture.md`.

## Деплой на Vercel
Цей репозиторій готовий до схеми:
- **Vercel**: web-клієнт + serverless API (`/api/*`).
- **PostgreSQL**: зовнішній managed-сервіс (Neon, Supabase, Railway Postgres).
- **Media/streaming**: окремий RTMP/HLS сервіс (SRS, Nginx-RTMP, Mux, Cloudflare Stream).

### 1) Підготуйте зовнішні сервіси
- Створіть Postgres і візьміть `DATABASE_URL`.
- Підніміть media сервер і отримайте:
  - ingest base URL (наприклад `rtmp://stream.example.com/live`)
  - playback base URL (наприклад `https://media.example.com`)

### 2) Додайте змінні у Vercel (Project Settings -> Environment Variables)
- Backend:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `REFRESH_SECRET`
  - `JWT_EXPIRES_IN` (опц., за замовчуванням `15m`)
  - `REFRESH_EXPIRES_IN` (опц., за замовчуванням `30d`)
  - `CORS_ORIGIN` (наприклад `https://your-app.vercel.app`)
  - `RTMP_INGEST_BASE_URL` (ваш RTMP ingest base)
- Frontend:
  - `VITE_API_URL=/api`
  - `VITE_MEDIA_SERVER_URL=https://media.example.com`

### 3) Імпортуйте репозиторій у Vercel
- Root: цей репозиторій.
- Конфіг уже є у `vercel.json`:
  - build web з `clients/web`
  - serverless API в `api/[[...route]].ts`

### 4) Після деплою
- Зареєструйте користувача в застосунку.
- Створіть стрім, перевірте `Server` і `Stream Key` в UI.
- У OBS вкажіть:
  - Server = `rtmp://.../live`
  - Stream Key = ключ з UI
- Перевірте playback у web-клієнті.
