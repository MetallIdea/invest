import { pgTable, varchar, uuid, numeric } from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import {users} from './users';

export const accounts = pgTable("accounts", {
  ...baseEntity,
  name: varchar().notNull(),
  accountId: varchar().notNull(),
  money: numeric({mode: 'number'}).notNull(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
});

export type Account = typeof accounts.$inferInsert;