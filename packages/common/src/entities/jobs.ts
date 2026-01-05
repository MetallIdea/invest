import * as t from "drizzle-orm/pg-core";
import { baseEntity } from "../data/baseEntity";

export const jobs = t.pgTable("jobs", {
  ...baseEntity,
  name: t.varchar().notNull(),
  schedule: t.varchar().notNull(),
  method: t.varchar().notNull(),
  lastRun: t.timestamp(),
  nextRun: t.timestamp(),
});

export type Job = typeof jobs.$inferSelect;
