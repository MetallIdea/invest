import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const candles = t.pgTable("invest_candles", {
  ...baseEntity,
  instrumentId: t.varchar().notNull(),
  interval: t.varchar(),
  time: t.timestamp(),
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
  low: t.numeric({
    mode: "number",
  }),
  high: t.numeric({
    mode: "number",
  }),
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
});
