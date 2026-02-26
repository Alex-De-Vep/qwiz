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

## Деплой frontend на GitHub Pages

В проект добавлен workflow `.github/workflows/deploy-pages.yml`, который публикует только `frontend` на GitHub Pages при пуше в `main`.

1. Откройте репозиторий в GitHub -> `Settings` -> `Pages`.
2. В `Build and deployment` выберите `Source: GitHub Actions`.
3. Сделайте push в `main` (или вручную запустите workflow `Deploy Frontend to GitHub Pages` во вкладке `Actions`).
4. После успешного деплоя страница будет доступна по адресу:
   `https://alex-de-vep.github.io/qwiz/`

Важно:
- GitHub Pages разворачивает только статический frontend.
- `backend` (Nuxt API) на Pages не запускается, его нужно деплоить отдельно (например, Timeweb/Amvera/VPS).
