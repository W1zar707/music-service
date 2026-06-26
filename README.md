# Waves — музыкальный стриминговый сервис

Fullstack-приложение для стриминга музыки. Backend на Django/DRF, frontend на React. Поддерживает потоковую передачу аудио, полнотекстовый поиск с русской морфологией, JWT-аутентификацию и объектное хранилище для медиафайлов. Всё запускается через Docker Compose.

## Стек

| Слой | Технологии |
|---|---|
| Backend | Python, Django, Django REST Framework |
| База данных | PostgreSQL 16 |
| Кэш / Auth | Redis 7 |
| Поиск | OpenSearch |
| Хранилище файлов | MinIO |
| Прокси | Nginx |
| Frontend | React, Vite, Zustand, Axios |
| Инфраструктура | Docker, Docker Compose |

## Запуск

Потребуется Docker и Docker Compose.

```bash
git clone https://github.com/W1zar707/music-service.git
cd music-service
cp .env.example .env
docker compose up --build
```

Приложение будет доступно на `http://localhost`.

Переменные окружения (`.env`):

```
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
REDIS_PASSWORD=
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
DJANGO_SECRET_KEY=
```

## Архитектура

```
Браузер
  │
  ▼
Nginx (port 80)
  ├── /api/*       → Gunicorn → Django/DRF
  ├── /internal/*  → MinIO (X-Accel-Redirect для аудио)
  └── /*           → React SPA

Django ──── PostgreSQL  (модели, ORM)
       ──── Redis       (семейства refresh-токенов)
       ──── MinIO       (загрузка аудио и обложек)
       ──── OpenSearch  (синхронизация поискового индекса)
```

## Аутентификация

Токены хранятся в HttpOnly-куках — JavaScript не имеет к ним доступа. При истечении access-токена Axios-интерцептор автоматически обновляет его, не прерывая запросы пользователя. Refresh-токены ротируются при каждом использовании; если обнаруживается повторное использование уже инвалидированного токена, всё семейство токенов отзывается через Redis.

## Поиск

OpenSearch индексирует треки, альбомы и исполнителей. Пайплайн анализа:

- русская морфология (стемминг)
- транслитерация кириллицы в латиницу
- ICU-фолдинг для нечувствительного к акцентам поиска
- edge-ngram на полях названий для автодополнения в реальном времени

Анализаторы для индексирования и поиска разделены: edge-ngram применяется только при индексировании, запросы используют стандартный анализатор.

## Структура репозитория

```
music-service/
├── backend/
│   ├── apps/
│   │   ├── users/
│   │   ├── music/
│   │   ├── search/
│   │   └── history/
│   ├── config/
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── components/
│       ├── store/
│       └── api/
├── nginx/
├── opensearch/
└── docker-compose.yml
```
