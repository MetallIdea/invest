import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { candles } from "./candles";

export const candlesParams = t.pgTable("invest_candles_params", {
  ...baseEntity,
  candleId: t
    .uuid()
    .notNull()
    .references(() => candles.id, { onDelete: "cascade" }),
  sma200: t.numeric({
    mode: "number",
  }),
  ema50: t.numeric({
    mode: "number",
  }),
  tr: t.numeric({
    mode: "number",
  }),
  atr14: t.numeric({
    mode: "number",
  }),
});

export type CandleParams = typeof candlesParams.$inferInsert;