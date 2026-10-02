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
│   ├── page.tsx            # Акции: SyncPanel, WeightsTable, SharesTable
│   ├── globals.css         # глобальные стили (CSS-переменные, темная тема)
│   └── page.module.css     # стили главной страницы
├── actions/
│   └── sync.ts             # server actions синхронизации и расчётов
├── api/
│   └── tinvest.ts          # обёртка Tinkoff Invest SDK
├── constants/              # константы
├── components/             # компоненты
│   ├── shares-table/       # таблица акций: свечи + VWAP (сортировка по клику)
│   ├── sync-panel/         # кнопки запуска sync/расчётов (antd)
│   └── weights-table/      # таблица весов покупки/продажи (сортировка по клику)
└── data/
    ├── db.ts               # синглтон `db` (drizzle + pg Pool)
    ├── schema.ts           # barrel: реэкспорт entities
    ├── entities/
    │   ├── base-entity.ts  # общие колонки для таблиц
    │   ├── candles.ts      # таблица candles (свечи)
    │   ├── indicators.ts   # таблица indicators (значения индикаторов)
    │   ├── share-weights.ts# таблица share_weights (веса покупки/продажи)
    │   ├── shares.ts       # таблица shares (справочник акций)
    │   └── users.ts        # таблица users
    └── services/
        ├── candles-cache.ts    # синхронизация свечей из Tinkoff в candles
        ├── indicators-cache.ts # расчёт и сохранение индикаторов (VWAP, ATR, RSI, MACD, EMA)
        ├── share-weights-cache.ts # расчёт весов покупки/продажи по индикаторам
        └── shares-cache.ts     # кеширование акций из Tinkoff в shares
```

## Ключевые модули

### Слой данных ([`src/data/`](src/data))
- [`db.ts`](src/data/db.ts:9) — экспорт `db`: `drizzle(pool, { schema, casing: 'snake_case' })`.
- [`base-entity.ts`](src/data/entities/base-entity.ts:3) — общий набор колонок:
  `id` (`uuid` PK `defaultRandom`), `createdAt`/`createdBy`, `updatedAt` (`$onUpdate`), `updatedBy`.
  Всегда разворачивается через `...baseEntity` в таблицах.
- [`users.ts`](src/data/entities/users.ts:4) — таблица `users`: `fullName` (notNull), `email` (unique) + base.
- [`shares.ts`](src/data/entities/shares.ts:4) — таблица `shares` (справочник акций): `name`, `ticker`, `figi` (unique),
  `sector`, `country` + base.
- [`indicators.ts`](src/data/entities/indicators.ts:4) — таблица `indicators` (значения индикаторов):
  `figi`, `time`, `interval`, `indicator`, `parameters` (`jsonb`), `value` (`numeric`) + base;
  уникальность по `figi + interval + time + indicator + parameters`.
- [`shares-cache.ts`](src/data/services/shares-cache.ts:18) — `syncShares()`: выгружает акции из Tinkoff (`getAllShares`)
  и upsert'ит их в `shares` по `figi` (`onConflictDoUpdate`, батчами по 500).
- [`candles-cache.ts`](src/data/services/candles-cache.ts:59) — `syncCandles()`: дневные свечи из Tinkoff в `candles`
  (накопительно с последней сохранённой даты, upsert по `figi + interval + time`).
- [`indicators-cache.ts`](src/data/services/indicators-cache.ts:29) — расчёт и сохранение индикаторов в `indicators`:
  - `calculateVwap()`: VWAP (накопительно: `Σ(typicalPrice·volume) / Σvolume`);
  - `calculateIndicators()`: ATR (14), RSI (9, 14), MACD (12/26/9, 5/13/9, 3/10/16 — линия, сигнал, гистограмма)
    и EMA (9, 21). Индикаторы в таблице: `vwap`, `atr`, `rsi`, `macd`/`macd_signal`/`macd_hist`, `ema`.
- [`share-weights.ts`](src/data/entities/share-weights.ts:4) — таблица `share_weights` (веса сигналов):
  `figi` (unique), `buyWeight`/`sellWeight` (`numeric` 0–100), `signal` (`buy`/`sell`/`neutral`),
  `lastIndicatorTime` + base.
- [`share-weights-cache.ts`](src/data/services/share-weights-cache.ts) — `calculateShareWeights()`:
  по последним значениям индикаторов (RSI 14, MACD-гистограмма 12/26/9 нормированная на ATR,
  отклонение цены от EMA 9/21 и VWAP) считает веса покупки/продажи (взвешенная сумма 25/25/30/20,
  нормализация по доступным группам) и upsert'ит их в `share_weights` по `figi`.
- [`weights-table.tsx`](src/components/weights-table/weights-table.tsx) — таблица весов с сортировкой
  по тикеру, весу покупки, весу продажи и сигналу; отображает шкалы заполнения и бейджи сигналов.
- Каждая сущность экспортирует тип `typeof table.$inferInsert` (например, `User`, `WebSite`).

### Tinkoff Invest ([`src/api/tinvest.ts`](src/api/tinvest.ts))
- Модуль инициализирует SDK на верхнем уровне: `await InvestNodeSDK.create({ token, url })` — **только серверный контекст** (server components / route handlers), в клиентские компоненты не импортировать.
- `getAllShares()` — все инструменты типа «акция».
- `getCandlesByShare(figi, from, to, interval)` — свечи по `figi` (по умолчанию дневной интервал).

## Конвенции

- **Импорты**: алиас `@/*` → `src/*` (см. `tsconfig.json` paths).
- **Стиль**: только одинарные кавычки (ESLint error), строгий TS. В названии файла используется CebabCase. Название компонентов в PascalCase.
- **БД**: в Drizzle указан `casing: 'snake_case'` (и в `drizzle.config.ts`) — поля в коде пишутся camelCase (`fullName` → `full_name`), имена таблиц — snake_case (`web_sites`).
- **Сущности**: `pgTable` + спред `baseEntity`, рядом тип `$inferInsert`.
- **Миграции**: пока только `db:push` (папка `drizzle/` для метаданных, без history).
- **SSR**: Данные из БД на страницу передаются через getInitialData
- **Компоненты**: Используются функциональные компоненты. Экспорт через `export function` или `export const`. Используются готовые компоненты из библиотеки `andd`. Компоненты хранятся внутри папки `src/components/.
- **Взаимодействие с сервером**: Для запросов на сервер используются server actions.

## Подводные камни

- `tinvest.ts` с top-level await — импортировать только в серверные модули, иначе утечка env-токенов в клиентский бандл.
- Изменение схемы БД требует `npm run db:push` с заданным `DATABASE_URL`.