# Team Bahrain

The official website for Team Bahrain / the Bahrain Olympic Committee — a
Next.js + PostgreSQL rebuild of the `Team Bahrain.dc.html` Claude Design
concept, covering eight public routes (Home, History, Sports, Athletes,
All-time Medals, News, Videos, Events) plus an admin panel for managing
all of that content.

> **Placeholder content.** Athlete facts, medal records and news items are
> ported verbatim from the design prototype for development purposes. The
> handoff explicitly flags that this data was written from memory and
> **must be verified against the official BOC/IOC record before
> publication.** All photography is a generated placeholder tile pending
> real BOC photography.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- PostgreSQL via raw `pg` (no ORM) — see `src/lib/db.ts`
- NextAuth v5 (credentials + bcrypt) for the admin panel, session cookie via JWT
- `lucide-react` for admin icons, `recharts` for the analytics chart
- Self-hosted, privacy-conscious visitor analytics (no third-party tracker, no IP storage)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`, point `DATABASE_URL` at your Postgres
   instance, and set `AUTH_SECRET` (`openssl rand -base64 32`):

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

5. Create an admin account:

   ```bash
   npm run seed:admin -- "Your Name" you@example.com admin-username a-strong-password
   ```

6. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site,
   or [http://localhost:3000/admin](http://localhost:3000/admin) to sign in
   and manage content.

## Admin panel

`/admin` is protected by `src/proxy.ts` (Next 16's renamed `middleware.ts`) —
unauthenticated visitors are redirected to `/login`. Eleven of the twelve
content sections (Athletes, Sports, News, Videos, Events, Timeline, Legends,
Instagram, Home figures, Continental stats, Ticker) share one generic
CRUD system:

- `src/lib/admin/resources.ts` — declares each resource's table and fields (a
  simple, whitelisted config — never derived from request input, since column
  names get interpolated into SQL).
- `src/lib/admin/crud.ts` — generic parameterized `list/create/update/delete`
  against Postgres, driven by that config.
- `src/app/api/admin/[resource]/route.ts` + `[id]/route.ts` — one pair of
  route handlers serving all eleven resources.
- `src/app/admin/[resource]/page.tsx` + `AdminResourceManager.tsx` — one page
  and one client component rendering the list + form for whichever resource
  is in the URL.

**Olympic medals** are the exception: they're a two-level Games → medal-record
structure (mirroring how the public medal table is built from leaf data, never
stored totals), so they get their own nested UI at `/admin/medals`
(`MedalsManager.tsx`) and API routes under `/api/admin/games`.

Image fields upload through `/api/admin/upload` (PNG/JPEG/WebP, 8MB max) to
`public/uploads/` (gitignored — runtime data, not source) and store the
returned path on the row.

The admin UI (`src/components/admin/ui/*` — `Card`, `StatCard`, `Badge`,
`Button`) uses a neutral indigo/slate palette, deliberately distinct from the
public site's red/black so the two are never confused.

## Analytics

`/admin/analytics` shows real visitor traffic on the public site — views over
the last 30 days, top pages, and top referrers — backed by a `page_views`
table (`path`, `referrer`, `device`, `created_at`; **no IP address stored**).

- `src/components/analytics/Analytics.tsx` — a tiny client component mounted
  only in `(site)/layout.tsx` (so admin/login usage isn't counted as "site
  traffic"). Fires `navigator.sendBeacon("/api/track", ...)` on every route
  change; skips when `navigator.webdriver` is set, to keep automated/test
  traffic out of the numbers.
- `src/app/api/track/route.ts` — the public ingest endpoint.
- `src/lib/admin/analytics.ts` — the aggregate queries (`getTrafficSummary`,
  `getViewsByDay`, `getTopPages`, `getTopReferrers`), plus `getContentCounts`
  for the dashboard's content stats.

The dashboard (`/admin`) also surfaces `getContentCounts` as stat cards, so
you can see at a glance how much content of each type exists.

## Project layout

- `src/app/(site)/*` — the 8 public route pages, grouped so they share the
  header/ticker/footer chrome from `(site)/layout.tsx` without leaking into
  `/admin` or `/login`.
- `src/app/admin/*`, `src/app/login/*`, `src/app/api/admin/*`, `src/app/api/auth/*` — the admin panel and its API.
- `src/components/` — `layout/` (public chrome), `shared/` (ImageTile, Countdown, SectionHead), `admin/` (AdminSidebar, AdminResourceManager, MedalsManager), and one folder per public-page domain (`home/`, `athletes/`, `medals/`, `events/`).
- `src/lib/data/*` — server-only Postgres query functions for the public site, one file per domain.
- `src/lib/admin/*` — the generic CRUD layer, resource config, admin nav, and analytics queries.
- `src/components/analytics/Analytics.tsx` — the visitor-traffic beacon (public site only).
- `src/lib/db.ts` — the `pg` pool + `query`/`queryOne` helpers (no SSL — matches the single-VM Postgres-on-localhost hosting pattern used by this user's other Next.js projects).
- `src/lib/site.config.ts` — fixed structural constants (nav, footer links, filter chip labels, the LA2028 countdown target).
- `src/auth.ts` / `src/proxy.ts` — NextAuth config and the route proxy protecting `/admin`.
- `sql/schema.sql` — table definitions.
- `scripts/seed.ts` — seeds the sample public content ported from the design prototype.
- `scripts/seed-admin.ts` — creates/updates an admin login.
