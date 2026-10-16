import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    // Works locally against the sandbox Postgres and on any hosted Postgres
    // (e.g. Neon) when DATABASE_URL is provided via environment variables.
    url:
      process.env.DATABASE_URL ??
      process.env.NETLIFY_DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
