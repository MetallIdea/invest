import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql', // указываем диалект
  schema: './src/data/schema.ts', // путь к вашей схеме
  out: './drizzle', // папка для метаданных (необязательно для push, но полезно)
  dbCredentials: {
    url: process.env.DATABASE_URL!, // строка подключения (postgres://user:password@host:port/db)
  },
  casing: 'snake_case',
});