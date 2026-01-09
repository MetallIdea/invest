import { pgTable, varchar, uuid, numeric } from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const shares = pgTable("invest_shares", {
  ...baseEntity,
  name: varchar(),
  figi: varchar().notNull(),
  countryOfRisk: varchar(),
  sector: varchar(),
  ticker: varchar(),
  lot: numeric({
    mode: "number",
  }),
});

export type Share = typeof shares.$inferSelect;
