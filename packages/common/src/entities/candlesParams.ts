import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const candlesParams = t.pgTable("invest_candles_params", {
  ...baseEntity,
  name: t.varchar(),
  description: t.varchar(),
  order: t.numeric({ mode: "number" }),
  calculate: t.varchar().notNull(),
});

export type CandleParams = typeof candlesParams.$inferInsert;
