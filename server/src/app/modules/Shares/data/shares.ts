import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const shares = pgTable("invest_shares", {
  id: uuid("id").primaryKey(),
  name: varchar(),
});