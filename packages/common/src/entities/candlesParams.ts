import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const candlesParams = t.pgTable("invest_candles_params", {
  ...baseEntity,
  name: t.varchar(),
  description: t.varchar(),
  order: t.varchar(),
  calculate: t.varchar(),
});

export type CandleParams = typeof candlesParams.$inferInsert;
