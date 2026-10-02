import { bigint, index, numeric, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { baseEntity } from './base-entity';

export const candles = pgTable(
  'candles',
  {
    figi: varchar({ length: 16 }).notNull(),
    interval: varchar({ length: 32 }).notNull(),
    open: numeric({ precision: 20, scale: 9 }).notNull(),
    high: numeric({ precision: 20, scale: 9 }).notNull(),
    low: numeric({ precision: 20, scale: 9 }).notNull(),
    close: numeric({ precision: 20, scale: 9 }).notNull(),
    volume: bigint({ mode: 'number' }).notNull(),
    time: timestamp().notNull(),
    ...baseEntity,
  },
  (table) => [
    // уникальность: одна свеча на инструмент, интервал и время открытия
    uniqueIndex('candles_figi_interval_time_unique').on(table.figi, table.interval, table.time),
    // выборка свечей по инструменту
    index('candles_figi_time_idx').on(table.figi, table.time),
  ],
);

export type Candle = typeof candles.$inferInsert;