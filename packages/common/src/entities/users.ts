import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const users = pgTable("users", {
  ...baseEntity,
  login: varchar().notNull(),
  password: varchar().notNull(),
});

export type User = typeof users.$inferInsert;
