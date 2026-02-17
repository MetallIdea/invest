import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../entities/schema";

const dbUrl = process.env.DATABASE_URL;

export const db = drizzle(dbUrl, {
  schema,
  casing: "snake_case",
});
