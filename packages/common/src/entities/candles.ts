import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const candles = t.pgTable("invest_candles", {
  ...baseEntity,
  instrumentId: t.varchar().notNull(),
  interval: t.varchar(),
  time: t.timestamp().notNull(),
  open: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  close: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  low: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  high: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  diff: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  diffLow: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  diffHigh: t
    .numeric({
      mode: "number",
    })
    .notNull(),
  volume: t.numeric({
    mode: "number",
  }),
  isComplete: t.boolean(),
  sma27: t.numeric({
    mode: "number",
  }),
  sma50: t.numeric({
    mode: "number",
  }),
  sma200: t.numeric({
    mode: "number",
  }),
  macd: t.numeric({
    mode: "number",
  }),
  signal: t.numeric({
    mode: "number",
  }),
  signalValue: t.numeric({
    mode: "number",
  }),
  ema9: t.numeric({
    mode: "number",
  }),
  ema12: t.numeric({
    mode: "number",
  }),
  ema26: t.numeric({
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

export type Candle = typeof candles.$inferInsert;
