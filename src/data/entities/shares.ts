import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { baseEntity } from './base-entity';

export const shares = pgTable('shares', {
  name: varchar({ length: 255 }).notNull(),
  ticker: varchar({ length: 64 }).notNull(),
  figi: varchar({ length: 16 }).notNull().unique(),
  sector: varchar({ length: 255 }),
  country: varchar({ length: 128 }),
  ...baseEntity,
});

export type Share = typeof shares.$inferInsert;