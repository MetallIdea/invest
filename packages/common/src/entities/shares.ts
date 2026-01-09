import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const shares = pgTable("invest_shares", {
  ...baseEntity,
  name: varchar(),
  figi: varchar().notNull(),
  countryOfRisk: varchar(),
  sector: varchar(),
  ticker: varchar(),
});

export type Share = typeof shares.$inferSelect;