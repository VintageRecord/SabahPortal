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
