# Архітектура стрімінг-платформи

## Протокол і медіа-транспорт
- Основний низьколатентний шлях: **WebRTC** для стрімера й глядача (SFU/шлюз можна додати пізніше).
- Резерв/сумісність: **RTMP ingest → HLS** для глядачів, щоб підтримати прості клієнти та CDN-кешування.
- Адаптивне відео: HLS з ABR, сегменти 2–4 с, кодування H.264 + AAC за замовчуванням.
- Чат та сигнальний канал: **WebSocket**.

## Стек
- Backend: **Node.js + Fastify (TypeScript)**, JWT/refresh, Postgres через `pg`, кеш/пабсаб через **Redis** (чат, токени).
- БД: **PostgreSQL** (users, refresh_tokens, streams, stream_keys, chat_bans).
- CDN/об’єктне сховище: S3-сумісне (наприклад, minio) для HLS сегментів і плейлистів.
- Логи/метрики: `pino`, Prometheus експортер, healthchecks `/health`.

## Директрії монорепо
- `backend/` — API, auth, чат, керування стрімами.
- `clients/web/` — веб-програвач + панель стрімера.
- `clients/mobile/` — Flutter клієнт (глядач + базовий стрімер WebRTC/RTMP).
- `clients/desktop/` — Electron оболонка (перегляд/керування, може вбудовувати веб).
- `packages/` — спільні пакети (UI, моделі) — базовий каркас.

## Безпека
- Паролі: Argon2/bcrypt; токени: короткий-lived access JWT + довший refresh у БД з ротацією.
- Rate limiting на логін/ingest; CORS з allowlist; TLS обов’язковий.
- Ключ стріму індивідуальний, перевіряється перед ingest.

## Розгортання (початково)
- Arch Linux ноутбук як origin: запустити `backend`, Nginx (reverse proxy) і медіа стек (rtmp/hls, наприклад, nginx-rtmp або mediasoup/SRS).
- CDN/кеш: можна почати з прямої роздачі з origin, потім винести в CDN.
