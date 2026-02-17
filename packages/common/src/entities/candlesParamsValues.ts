import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { candles } from "./candles";
import { candlesParams } from "./candlesParams";
import { relations } from "drizzle-orm";

export const candlesParamsValues = t.pgTable("invest_candles_params_values", {
  ...baseEntity,
  candleId: t
    .uuid()
    .notNull()
    .references(() => candles.id, { onDelete: "cascade" }),
  paramId: t
    .uuid()
    .notNull()
    .references(() => candlesParams.id, { onDelete: "cascade" }),
  value: t.numeric({
    mode: "number",
  }),
});

export const customParamsRelations = relations(candlesParamsValues, ({ one }) => ({
  candle: one(candles, {
    fields: [candlesParamsValues.candleId],
    references: [candles.id],
  }),
}));

export type CandleParamsValue = typeof candlesParamsValues.$inferInsert;
