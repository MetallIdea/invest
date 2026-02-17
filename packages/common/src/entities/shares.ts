import { pgTable, varchar, numeric } from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { relations } from "drizzle-orm";
import { Candle, candles } from "./candles";

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

export const sharesRelations = relations(shares, ({ many }) => ({
  candles: many(candles),
}));

export type Share = typeof shares.$inferSelect;

export type ShareWithCandles = Share & {
  candles: Candle[];
};
