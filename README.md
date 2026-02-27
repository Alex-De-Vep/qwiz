# Qwiz

Небольшой проект-демо с авторизацией, выбором игры и мини-играми по продуктовой экосистеме.

## Стек

- `frontend`: Vite + vanilla JS
- `backend`: Nuxt (API/серверная часть)

## Что реализовано

- Страница авторизации (`/login`)
- Страница выбора игры (`/games`)
- Отдельные страницы игр:
  - `#/quiz` — квиз по продуктам
  - `#/matching` — сопоставление "продукт ↔ функция" (8 попыток)
  - `#/snake` — мини-игра "змейка"
- База знаний с продуктами (открывается кнопкой, на мобильных — как модальное окно)
- Сохранение прогресса игр в `localStorage`:
  - лучшие результаты
  - отображение статусов на странице выбора игры
  - сообщение о подарке при выполнении целей во всех играх

## Быстрый старт

```bash
npm install
npm run dev
```

После запуска:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health API backend: `http://localhost:4000/api/health`

## Полезные команды

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run build:frontend
npm run build:backend
```

## Структура

- `frontend/src/pages` — страницы (`login`, `games`, `quiz`, `matching`, `snake`)
- `frontend/src/components` — переиспользуемые UI-компоненты и общий layout игры
- `frontend/src/utils` — утилиты, данные квиза/продуктов, прогресс игр
- `backend/server/api` — backend API-роуты

## Деплой frontend на GitHub Pages

Frontend можно публиковать через GitHub Actions (`.github/workflows/deploy-pages.yml`).

1. Откройте репозиторий в GitHub -> `Settings` -> `Pages`
2. В `Build and deployment` выберите `Source: GitHub Actions`
3. Сделайте push в `main` или вручную запустите workflow `Deploy Frontend to GitHub Pages`

Адрес после деплоя:

- `https://alex-de-vep.github.io/qwiz/`

Важно: GitHub Pages публикует только `frontend` (статический сайт). `backend` нужно размещать отдельно.
