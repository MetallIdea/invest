import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const strategies = t.pgTable("invest_strategies", {
  ...baseEntity,
  name: t.varchar().notNull(),
  description: t.varchar(),
});
