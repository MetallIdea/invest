import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";
import { shares } from "./shares";

export const portfolio = t.pgTable("invest_portfolio", {
  ...baseEntity,
  shareId: t
    .uuid()
    .notNull()
    .references(() => shares.id, { onDelete: "cascade" }),
  count: t.integer().notNull(),
});
