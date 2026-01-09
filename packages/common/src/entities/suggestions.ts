import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { strategies } from "./strategies";
import { shares } from "./shares";

export const suggestions = t.pgTable("invest_suggestions", {
  ...baseEntity,
  instrumentId: t
    .uuid()
    .notNull()
    .references(() => shares.id, { onDelete: "cascade" }),
  time: t.timestamp(),
  buy: t.numeric({
    mode: "number",
  }),
  sell: t.numeric({
    mode: "number",
  }),
  buyTime: t.timestamp(),
  sellTime: t.timestamp(),
  max: t.numeric({
    mode: "number",
  }),
  strategyId: t
    .uuid()
    .notNull()
    .references(() => strategies.id, { onDelete: "cascade" }),
});

export type Suggestion = typeof suggestions.$inferSelect;
