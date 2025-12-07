import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Required: Specifies the path(s) to your schema file(s). Can use glob patterns.
  schema: "../common/entities/*.ts",

  // Required: Specifies the database dialect. Options: 'postgresql', 'mysql', 'sqlite', 'turso', 'singlestore'
  dialect: "postgresql",

  // Required for 'push' and 'migrate' CLI commands to connect to your DB
  dbCredentials: {
    // Uses the DATABASE_URL from your .env file
    url: process.env.DATABASE_URL!,
  },

  // Optional: Specifies where migration files will be stored. Default is './drizzle'
  out: "./drizzle",

  casing: "snake_case",

  // Optional: Enable detailed logging in the CLI
  verbose: true,

  // Optional: Enable strict mode for Drizzle Kit operations
  strict: false,
});
