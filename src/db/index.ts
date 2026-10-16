import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Local sandbox uses DATABASE_URL from .env; on Netlify the variable can be
// set per-site (or comes from a Neon integration as NETLIFY_DATABASE_URL).
const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.NETLIFY_DATABASE_URL ??
  process.env.NETLIFY_DB_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const isLocalHost = /@(127\.0\.0\.1|localhost)([:/]|$)/.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Hosted Postgres (e.g. Neon) requires TLS; local sandbox does not.
    ...(isLocalHost ? {} : { ssl: { rejectUnauthorized: false } }),
    // Small pool works best for serverless concurrency.
    max: 3,
    connectionTimeoutMillis: 8000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
