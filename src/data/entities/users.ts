import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { baseEntity } from './base-entity';

export const users = pgTable('users', {
  fullName: varchar().notNull(),
  email: varchar().unique(),
  ...baseEntity,
});

export type User = typeof users.$inferInsert;
