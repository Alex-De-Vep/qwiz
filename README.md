# Qwiz: Frontend + Backend Base

Минимальная основа проекта из двух частей:
- `frontend`: лёгкий Vite (vanilla JS) с мини-квизом
- `backend`: Nuxt (используется как backend с API)

## Запуск

```bash
npm install
npm run dev
```

После запуска:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health API: `http://localhost:4000/api/health`

## Полезные команды

```bash
npm run dev:frontend
npm run dev:backend
npm run build
```

## Быстрый деплой на Render

В репозитории уже есть файл `render.yaml` для двух сервисов:
- `qwiz-frontend` (Static Site)
- `qwiz-backend` (Web Service на Nuxt)

Как выложить:
1. Загрузите проект в GitHub/GitLab.
2. В Render нажмите **New +** -> **Blueprint**.
3. Подключите репозиторий и подтвердите создание сервисов из `render.yaml`.
4. После деплоя откройте URL `qwiz-frontend` — сайт станет публично доступен.
