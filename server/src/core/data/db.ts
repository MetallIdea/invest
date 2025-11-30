import { drizzle } from 'drizzle-orm/node-postgres';

const dbUrl = process.env.DATABASE_URL;

export const db = drizzle({ connection: dbUrl, casing: 'snake_case' })