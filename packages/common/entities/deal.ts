import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { shares } from "./shares";

export const deals = t.pgTable("invest_deals", {
  ...baseEntity,
  shareId: t
    .uuid()
    .notNull()
    .references(() => shares.id, { onDelete: "cascade" }),
  price: t.numeric({mode: 'number'}).notNull(),
  count: t.integer().notNull(),
  isBuy: t.boolean().notNull(),
});
