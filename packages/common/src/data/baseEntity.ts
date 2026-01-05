import { timestamp, uuid } from "drizzle-orm/pg-core";

export const baseEntity = {
  id: uuid("id").primaryKey().defaultRandom(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}