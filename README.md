# Team Bahrain

The official website for Team Bahrain / the Bahrain Olympic Committee — a
Next.js + PostgreSQL rebuild of the `Team Bahrain.dc.html` Claude Design
concept, covering eight routes: Home, History, Sports, Athletes,
All-time Medals, News, Videos and Events.

> **Placeholder content.** Athlete facts, medal records and news items are
> ported verbatim from the design prototype for development purposes. The
> handoff explicitly flags that this data was written from memory and
> **must be verified against the official BOC/IOC record before
> publication.** All photography is a generated placeholder tile pending
> real BOC photography.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- PostgreSQL via raw `pg` (no ORM) — see `src/lib/db.ts`
- No admin/auth yet: content is server-rendered straight from Postgres,
  seeded from `scripts/seed.ts`. An admin CRUD panel is a planned follow-up.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and point `DATABASE_URL` at your Postgres
   instance:

   ```bash
   cp .env.example .env
   ```

3. Create the database, then apply the schema:

   ```bash
   psql -U postgres -c "CREATE DATABASE team_bahrain"
   psql -U postgres -d team_bahrain -f sql/schema.sql
   ```

4. Seed sample content:

   ```bash
   npm run seed
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project layout

- `src/app/*` — the 8 route pages, plus the root layout (header/ticker/footer chrome).
- `src/components/` — `layout/` (chrome), `shared/` (ImageTile, Countdown, SectionHead), and one folder per page domain (`home/`, `athletes/`, `medals/`, `events/`).
- `src/lib/data/*` — server-only Postgres query functions, one file per domain.
- `src/lib/db.ts` — the `pg` pool + `query`/`queryOne` helpers (no SSL — matches the single-VM Postgres-on-localhost hosting pattern used by this user's other Next.js projects).
- `src/lib/site.config.ts` — fixed structural constants (nav, footer links, filter chip labels, the LA2028 countdown target).
- `sql/schema.sql` — table definitions.
- `scripts/seed.ts` — seeds the sample content ported from the design prototype.
