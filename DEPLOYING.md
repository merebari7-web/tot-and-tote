# Deploying Tot & Tote to Netlify

The project is deploy-ready: `netlify.toml` pins the official Next.js runtime
(`@netlify/plugin-nextjs`), Node 22, and the production build. You only need a
Git-hosted copy of this repo and a hosted PostgreSQL database.

---

## 1 · Push this repo to GitHub (or GitLab / Bitbucket)

```bash
# already initialised — just point it at your remote
git remote add origin git@github.com:you/tot-and-tote.git
git push -u origin main
```

## 2 · Create the production database (free Neon Postgres)

1. Go to [console.neon.tech](https://console.neon.tech) and create a project
   (free tier is plenty).
2. Copy the **pooled** connection string — it looks like
   `postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require`.

*(Alternatively use any hosted Postgres: Supabase, Railway, Render — just a
reachable `postgreSQL://…` string.)*

## 3 · Apply the schema and seed the store

From this project folder:

```bash
DATABASE_URL="your-neon-connection-string" npx drizzle-kit push
DATABASE_URL="your-neon-connection-string" npx tsx src/db/seed.ts
```

This creates all tables and loads the 15 products + sample orders.

## 4 · Import the site on Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an
   existing project** → pick your repo.
2. Build settings are detected automatically from `netlify.toml`
   (`npm run build`, publish `.next`) — click **Deploy** … once. This first
   deploy just gets the site shell up (the storefront is intentionally
   resilient and renders even before the database exists).
3. Go to **Site settings → Environment variables → Add a variable**:
   - Key: `DATABASE_URL`
   - Value: your Neon connection string from step 2
4. **Deploys → Trigger deploy → Deploy site.**

That's it — the store goes live with full ISR, serverless API routes,
cart/checkout and the admin dashboard at `/admin`.

---

## Environment variables

| Variable            | Where used                        | Notes                        |
| ------------------- | --------------------------------- | ---------------------------- |
| `DATABASE_URL`      | All pages/APIs via `src/db/index` | Neon pooled string preferred |

The code also accepts `NETLIFY_DATABASE_URL` / `NETLIFY_DB_URL` automatically,
so if you attach Netlify's native DB integration later it just works.

## CLI alternative (instead of step 4)

```bash
npm i -g netlify-cli
netlify login
netlify sites:create --name tot-and-tote   # or: netlify init
netlify env:set DATABASE_URL "your-neon-connection-string"
netlify deploy --build --prod
```

> ⚠️ Do **not** run `netlify env:import .env` — that would upload the local
> sandbox database URL.

## Useful endpoints

- `/` storefront (ISR, revalidates every 60 s)
- `/shop`, `/product/[slug]`, `/checkout`, `/order/confirmation`
- `/admin` — live store dashboard
- `/api/health` — health check
- `/api/products`, `/api/cart`, `/api/checkout`, `/api/newsletter`

## Changing the schema later

Edit `src/db/schema.ts`, then:

```bash
DATABASE_URL="your-neon-connection-string" npx drizzle-kit push
```

No app redeploy needed unless code changed.
