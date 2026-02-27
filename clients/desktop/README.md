# Streeming Desktop (Electron)

Проста оболонка, що відкриває веб-клієнт.

## Запуск
1. Встановіть залежності в корені: `pnpm install`.
2. Запустіть веб-клієнт `pnpm --filter web dev` (порт 5173).
3. Запустіть Electron: `pnpm --filter desktop start`.

## Налаштування
- `WEB_URL` (env) — посилання на вебклієнт, за замовчуванням `http://localhost:5173`.
