# Контекст проекта: invest

Файл-память агента. Обновляй при значительных изменениях архитектуры.

## Обзор

- **Invest** — помошник инвестиций на **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict) + **Ant Design v6** + **Formik**.
- Стек данных: **PostgreSQL** + **Drizzle ORM** (драйвер `node-postgres`, casing `snake_case`).
- Назначение (по текущему коду): интеграция с **Tinkoff Invest API**.
- UI на русском языке (`<html lang="ru">`), комментарии в коде — русские.

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Запуск dev-сервера Next.js |
| `npm run build` / `npm run start` | Production-сборка / запуск |
| `npm run lint` / `npm run lint:fix` | ESLint (core-web-vitals + typescript, одинарные кавычки) |
| `npm run db:push` | `drizzle-kit push` — применение схемы к БД |

## Переменные окружения (.env)

| Переменная | Где используется | Обязательна |
| --- | --- | --- |
| `DATABASE_URL` | [`src/data/db.ts`](src/data/db.ts), `drizzle.config.ts` | да |
| `INVEST_API_TOKEN` | [`src/api/tinvest.ts`](src/api/tinvest.ts) | для Tinkoff |
| `INVEST_API_HOST` | [`src/api/tinvest.ts`](src/api/tinvest.ts) | нет (default SDK) |

## Структура каталогов

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # AntdRegistry, навлинк → /websites
│   ├── page.tsx            # Home (заглушка, WIP)
│   ├── globals.css         # глобальные стили (CSS-переменные, темная тема)
│   └── page.module.css     # стили главной страницы
├── api/
│   └── tinvest.ts          # обёртка Tinkoff Invest SDK
├── constants/
└── data/
    ├── db.ts               # синглтон `db` (drizzle + pg Pool)
    ├── schema.ts           # barrel: реэкспорт entities
    └── entities/
        ├── base-entity.ts  # общие колонки для таблиц
        ├── users.ts        # таблица users
```

## Ключевые модули

### Слой данных ([`src/data/`](src/data))
- [`db.ts`](src/data/db.ts:9) — экспорт `db`: `drizzle(pool, { schema, casing: 'snake_case' })`.
- [`base-entity.ts`](src/data/entities/base-entity.ts:3) — общий набор колонок:
  `id` (`uuid` PK `defaultRandom`), `createdAt`/`createdBy`, `updatedAt` (`$onUpdate`), `updatedBy`.
  Всегда разворачивается через `...baseEntity` в таблицах.
- [`users.ts`](src/data/entities/users.ts:4) — таблица `users`: `fullName` (notNull), `email` (unique) + base.
- Каждая сущность экспортирует тип `typeof table.$inferInsert` (например, `User`, `WebSite`).

### Tinkoff Invest ([`src/api/tinvest.ts`](src/api/tinvest.ts))
- Модуль инициализирует SDK на верхнем уровне: `await InvestNodeSDK.create({ token, url })` — **только серверный контекст** (server components / route handlers), в клиентские компоненты не импортировать.
- `getAllShares()` — все инструменты типа «акция».
- `getCandlesByShare(figi, from, to, interval)` — свечи по `figi` (по умолчанию дневной интервал).

## Конвенции

- **Импорты**: алиас `@/*` → `src/*` (см. `tsconfig.json` paths).
- **Стиль**: только одинарные кавычки (ESLint error), строгий TS.
- **БД**: в Drizzle указан `casing: 'snake_case'` (и в `drizzle.config.ts`) — поля в коде пишутся camelCase (`fullName` → `full_name`), имена таблиц — snake_case (`web_sites`).
- **Сущности**: `pgTable` + спред `baseEntity`, рядом тип `$inferInsert`.
- **Миграции**: пока только `db:push` (папка `drizzle/` для метаданных, без history).
- **SSR**: Данные из БД на страницу передаются через getInitialData

## Подводные камни

- `tinvest.ts` с top-level await — импортировать только в серверные модули, иначе утечка env-токенов в клиентский бандл.
- Изменение схемы БД требует `npm run db:push` с заданным `DATABASE_URL`.