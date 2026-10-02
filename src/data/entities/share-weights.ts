import { index, numeric, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { baseEntity } from './base-entity';

export const shareWeights = pgTable(
  'share_weights',
  {
    figi: varchar({ length: 16 }).notNull(),
    /** Вес сигнала «покупка» (0–100), рассчитанный по техническим индикаторам. */
    buyWeight: numeric({ precision: 5, scale: 2 }).notNull(),
    /** Вес сигнала «продажа» (0–100), рассчитанный по техническим индикаторам. */
    sellWeight: numeric({ precision: 5, scale: 2 }).notNull(),
    /** Итоговый сигнал: buy | sell | neutral. */
    signal: varchar({ length: 16 }).notNull(),
    /** Время последнего индикатора, по которому рассчитаны веса. */
    lastIndicatorTime: timestamp().notNull(),
    ...baseEntity,
  },
  (table) => [
    // одна запись весов на инструмент
    uniqueIndex('share_weights_figi_unique').on(table.figi),
    // выборка акций по сигналу
    index('share_weights_signal_idx').on(table.signal),
  ],
);

export type ShareWeight = typeof shareWeights.$inferInsert;