import { index, jsonb, numeric, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { baseEntity } from './base-entity';

export const indicators = pgTable(
  'indicators',
  {
    figi: varchar({ length: 16 }).notNull(),
    time: timestamp().notNull(),
    interval: varchar({ length: 32 }).notNull(),
    indicator: varchar({ length: 64 }).notNull(),
    parameters: jsonb().notNull(),
    value: numeric({ precision: 20, scale: 9 }).notNull(),
    ...baseEntity,
  },
  (table) => [
    // уникальность: одно значение индикатора на инструмент, интервал, время и набор параметров
    uniqueIndex('indicators_figi_interval_time_indicator_params_unique').on(
      table.figi,
      table.interval,
      table.time,
      table.indicator,
      table.parameters,
    ),
    // выборка значений индикатора по инструменту
    index('indicators_figi_time_idx').on(table.figi, table.time),
  ],
);

export type Indicator = typeof indicators.$inferInsert;