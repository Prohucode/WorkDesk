# Workdesk: журнал работ на строительном объекте

Веб-приложение для фиксации выполненных работ на строительном объекте. Прораб может добавлять записи журнала, фильтровать их по датам, редактировать через модальное окно, удалять записи и смотреть сводку на дашборде.

## Возможности

- Дашборд с метриками и столбчатым графиком объема работ по дням.
- Таблица записей журнала с сортировкой и фильтром по дате.
- Создание, редактирование и удаление записей.
- Справочник видов работ.
- REST API для фронтенда.
- AdminJS для администрирования данных.
- PostgreSQL хранит данные в volume.
- Docker Compose dev-режим с hot reload через bind mounts.

## Стек

- Frontend: React, TypeScript, Vite, shadcn/ui, Tailwind CSS, Recharts.
- Backend: Node.js, Express, TypeScript, Zod, Sequelize, AdminJS.
- Database: PostgreSQL.
- Infra: Docker Compose.

## Быстрый запуск

Требуется Docker и Docker Compose.

```bash
docker compose up -d --build
```

После запуска:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Healthcheck: http://localhost:3000/api/health
- Swagger UI: http://localhost:3000/api-docs
- AdminJS: http://localhost:3000/admin

Доступ в AdminJS по умолчанию:

```text
email: admin@example.com
password: admin
```

## Docker Compose

Сервисы:

- `frontend` - Vite dev server, порт `5173`.
- `backend` - Express API, порт `3000`.
- `postgres` - PostgreSQL внутри Docker-сети.

PostgreSQL не проброшен наружу. Бэкенд подключается к базе по внутреннему адресу:

```text
postgres://workdesk:workdesk@postgres:5432/workdesk
```

Локальные директории смонтированы в контейнеры:

```yaml
./frontend:/app
./backend:/app
```

`node_modules` вынесены в отдельные Docker volumes, чтобы локальные файлы не перетирали зависимости контейнера.

## Разработка

Запустить весь стек:

```bash
docker compose up -d
```

Смотреть логи:

```bash
docker compose logs -f frontend
docker compose logs -f backend
```

Остановить контейнеры:

```bash
docker compose down
```

Остановить и удалить volume с данными PostgreSQL:

```bash
docker compose down -v
```

## Локальные проверки

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm install
npx tsc --noEmit
```

## Переменные окружения

Основные значения уже заданы в `docker-compose.yml`.

Для backend:

```text
PORT=3000
DATABASE_URL=postgres://workdesk:workdesk@postgres:5432/workdesk
SESSION_SECRET=workdesk-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin
```

Для frontend:

```text
VITE_API_URL=http://localhost:3000/api
```

## Структура проекта

```text
.
├── backend
│   ├── src
│   │   ├── models
│   │   ├── routes
│   │   ├── admin.ts
│   │   ├── db.ts
│   │   └── index.ts
│   └── Dockerfile
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── lib
│   │   └── types
│   └── Dockerfile
└── docker-compose.yml
```

## API

Основные endpoint'ы:

- `GET /api/work-types` - список видов работ.
- `POST /api/work-types` - создание вида работ, если такого еще нет.
- `GET /api/work-logs` - список записей журнала.
- `POST /api/work-logs` - создание записи.
- `PUT /api/work-logs/:id` - редактирование записи.
- `DELETE /api/work-logs/:id` - удаление записи.

Параметры фильтра для `GET /api/work-logs`:

```text
dateFrom=YYYY-MM-DD
dateTo=YYYY-MM-DD
sort=asc|desc
```
