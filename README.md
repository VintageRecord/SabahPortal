# Pesta Sukan Antara Wilayah [PESAWI] Ke-13

A Sofascore-inspired live scoring portal for **Pesta Sukan Antara Wilayah [PESAWI] Ke-13**,
covering 9 sports played in a round-robin format:

- Badminton (Berpasukan)
- Sepak Takraw (Berpasukan)
- Pickleball (Berpasukan)
- Ping Pong (Berpasukan)
- Bola Tampar (Lelaki / Wanita)
- Dart (Berpasukan)
- Petanque (Berpasukan)
- Karom (Berpasukan)
- Futsal (Lelaki / Veteran / Wanita)

Public site: live score ticker, fixtures grouped by round, round-robin standings tables, and a
streaming tab where the organizer can link out to TikTok, YouTube, Facebook or other live
broadcasts.

Admin panel (`/admin`): update live scores and match status, manage teams, regenerate
round-robin fixtures, manage stream links, and edit event settings (title, dates, points system).
Everything seeded in the database (sports, teams, venues, times) can be changed later from here.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma ORM
- Cookie-based admin session (no external auth service required)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — PostgreSQL connection string.
   - `DIRECT_URL` — same as `DATABASE_URL` for a plain Postgres instance (only differs from
     `DATABASE_URL` when using a pooled provider like Neon — see the Vercel deployment section).
   - `ADMIN_PASSWORD` — password for `/admin`.
   - `SESSION_SECRET` — random string used to sign the admin session cookie.

3. Make sure PostgreSQL is running and the database in `DATABASE_URL` exists, then run migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed the championship data (9 sports, divisions, Sabah-district teams, round-robin fixtures):

   ```bash
   npm run db:seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) for the public site and
   [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Useful scripts

| Script              | Description                                     |
| -------------------- | ------------------------------------------------ |
| `npm run dev`         | Start the Next.js dev server                     |
| `npm run build`       | Production build                                  |
| `npm run start`       | Run the production build                          |
| `npm run lint`        | Lint the codebase                                  |
| `npm run db:migrate`  | Run Prisma migrations                              |
| `npm run db:seed`     | Reset and seed the database with demo championship data |
| `npm run db:studio`   | Open Prisma Studio to browse/edit the database directly |

## Data model

`Sport` → `Division` (e.g. Lelaki/Wanita/Veteran/Berpasukan) → `Team` and `Match`, plus
`StreamLink` per division and a single `EventSettings` row for global event info and the
win/draw/loss points system used to compute standings. Standings are always derived from
`FINISHED` matches — nothing is stored redundantly, so admin edits to scores/status are reflected
immediately everywhere.

## Notes on deployment

- The app needs a persistent Node.js server (not a purely static host) since it reads/writes
  PostgreSQL on every request via Prisma and uses Next.js Server Actions for admin mutations.
- Live scores refresh on the public site via lightweight polling (`/api/live`,
  `/api/matches?divisionId=...`) every 10 seconds — no websocket infrastructure required.

## Deploying to Vercel + Neon (recommended, free forever)

Vercel's Hobby plan and Neon's free Postgres tier are both free indefinitely (no trial expiry),
which is why this is the default recommendation. The schema uses Prisma's `directUrl` so
migrations run over Neon's unpooled connection while the app itself uses the pooled one — needed
because Vercel functions can open many concurrent connections, which a normal Postgres connection
limit can't handle.

1. **Create a Neon project** at [neon.tech](https://neon.tech) (free, no credit card required).
   In its dashboard's "Connect" panel, copy both connection strings it gives you:
   - **Pooled connection** (hostname contains `-pooler`) → this is `DATABASE_URL`.
   - **Direct connection** (no `-pooler`) → this is `DIRECT_URL`.
2. **Import the project** at [vercel.com](https://vercel.com) → "Add New" → "Project" → select
   this GitHub repo and branch. Vercel auto-detects Next.js; no build settings need changing
   (it automatically runs the `vercel-build` script already defined in `package.json`, which does
   `prisma migrate deploy` before `next build`).
3. **Set environment variables** in the project's Settings → Environment Variables:
   - `DATABASE_URL` — the pooled Neon connection string.
   - `DIRECT_URL` — the direct Neon connection string.
   - `ADMIN_PASSWORD` — a real password for `/admin`.
   - `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
4. **Deploy.** Vercel builds it, running the pending migration automatically as part of the build.
5. **Seed the initial data** (one-time): Vercel doesn't offer a remote shell, so run the seed
   script from your own machine pointed at the production database instead — it connects to
   Neon directly over the network:

   ```bash
   DATABASE_URL="<paste the same pooled connection string>" npm run db:seed
   ```

   **Do not** run this again later — it wipes and regenerates all sports/teams/matches, erasing
   any real results entered through the admin panel.
6. **Custom domain** (optional): Settings → Domains on the Vercel project, then add the DNS
   record it gives you at your provider.

Every subsequent `git push` to the connected branch auto-deploys, running migrations again each
time (safe — `migrate deploy` only applies migrations that haven't run yet).

## Deploying to Railway (alternative)

This repo includes a `railway.toml` and a `postinstall` script (`prisma generate`), so Railway's
Nixpacks builder can deploy it with no extra configuration beyond environment variables.

1. **Create a project** at [railway.app](https://railway.app) → "New Project" → "Deploy from
   GitHub repo" → pick this repository and the branch you want to deploy.
2. **Add PostgreSQL**: in the same project, click "New" → "Database" → "Add PostgreSQL". Railway
   provisions it and exposes its own `DATABASE_URL` variable automatically.
3. **Set environment variables** on the *app* service (Variables tab):
   - `DATABASE_URL` and `DIRECT_URL` — both as "Add Reference" pointing at the Postgres service's
     `DATABASE_URL` (Railway's Postgres isn't pooled, so both variables use the same value; using
     a reference instead of pasting it in as plain text keeps it in sync if Railway ever rotates
     credentials).
   - `ADMIN_PASSWORD` — choose a real password for `/admin`.
   - `SESSION_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`).
4. **Deploy**. Railway runs `npm install` (which triggers `prisma generate` via `postinstall`),
   then `npm run build`, then the configured start command:
   `npx prisma migrate deploy && npm run start` — this applies any pending migrations before the
   server boots, every time you deploy. It's safe to run repeatedly since `migrate deploy` only
   applies migrations that haven't run yet.
5. **Seed the initial data** (one-time, after the first successful deploy): open a shell against
   the deployed service — either via the Railway CLI (`railway link` then `railway run npm run
   db:seed`) or the "Run Command" option in the service's dashboard. **Do not** re-run this later;
   it wipes and regenerates all sports/teams/matches, which would erase real results entered
   through the admin panel.
6. **Custom domain** (optional): Settings → Networking → "Custom Domain" on the app service, then
   add the CNAME record it gives you at your DNS provider.

After that, the public site and `/admin` panel are live at the Railway-provided URL (or your
custom domain). Every subsequent `git push` to the connected branch auto-deploys.
