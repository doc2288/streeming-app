# Backend (Fastify)

## Запуск локально
1. Скопіюйте `.env.example` → `.env` і заповніть `DATABASE_URL`, `JWT_SECRET`.
2. Увімкніть розширення в Postgres: `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`.
3. Встановіть залежності в корені: `pnpm install`.
4. Запустіть: `pnpm dev` (порт 4000).

## Маршрути
- `POST /auth/register` { email, password }
- `POST /auth/login` { email, password }
- `POST /auth/refresh` { refreshToken }
- `GET /auth/me` (Bearer)
- `GET /streams`
- `POST /streams` (Bearer) — створити стрім + ключ
- `POST /streams/:id/start|stop` (Bearer)
- `GET /chat/:streamId` — WebSocket чат
- `GET /health`

## Нотатки
- Refresh-токени зберігаються в таблиці `refresh_tokens` (рандомний ключ + expires_at).
- Ingest базовий: `rtmp://localhost/live/{user}` із `stream_key` (інтегруйте у ваш медіа-сервер, напр. nginx-rtmp або SRS).
- Плейлист HLS у вебклієнті зараз показує тестовий URL; підставте власний шлях CDN/origin.
