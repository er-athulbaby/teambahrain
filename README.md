# Team Bahrain

The official website for Team Bahrain / the Bahrain Olympic Committee — a
Next.js + PostgreSQL rebuild of the `Team Bahrain.dc.html` Claude Design
concept, covering eight public routes (Home, History, Sports, Athletes,
All-time Medals, News, Videos, Events), a per-Games-edition section
(`/games`, e.g. Paris 2024 — Delegation/Players/Events/Results/Medals),
plus an admin panel for managing all of it.

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

6. Seed the editable page text/images (headlines, intros, hero photo — safe
   to re-run any time, never overwrites an existing edit):

   ```bash
   npm run seed:page-content
   ```

7. Seed an example Games edition (Paris 2024, so `/games` isn't empty):

   ```bash
   npm run seed:games
   ```

8. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site,
   or [http://localhost:3000/admin](http://localhost:3000/admin) to sign in
   and manage content.

## Admin panel

`/admin` is protected by `src/proxy.ts` (Next 16's renamed `middleware.ts`) —
unauthenticated visitors are redirected to `/login`. `admins.role` is either
`"admin"` (full access) or `"editor"` (all content — resources, medals, page
content — but not Users, Analytics, or Site settings; enforced both in
`requireAdmin({ adminOnly: true })` on the relevant API routes and as a
`redirect()` guard in the page components themselves, and the sidebar
(`AdminSidebar.tsx`) hides those nav items for editors). Manage accounts at
`/admin/users` (`UsersManager.tsx`); password resets still go through
`npm run seed:admin` rather than a UI flow.

Eleven of the twelve
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

### Page content (hero text/images, headlines, intros)

Beyond the repeating resources above, every page also has one-off design
copy — a hero headline, an intro paragraph, a feature photo — that isn't a
list item. That's a separate, simpler system under **"Page content"** in the
sidebar (`/admin/pages/<page>`, one form per public page):

- `src/lib/admin/pageContentConfig.ts` — for each page, the list of editable
  fields (text/textarea/image) **and their current default copy** — the
  single source of truth for both what the admin form shows and what the
  public site falls back to if nothing's been edited yet.
- `page_content` table — flat `(page, field_key, value)` rows; only present
  once someone edits something, since `getPageContent()`
  (`src/lib/data/pageContent.ts`) always merges DB values over the config
  defaults.
- `src/app/api/admin/page-content/[page]/route.ts` + `PageContentManager.tsx`
  — GET/PATCH for one page's fields, same whitelisted-by-config safeguard as
  the resource CRUD layer.
- `npm run seed:page-content` inserts the defaults with `ON CONFLICT DO
  NOTHING`, so it's safe to run after adding a new field to the config
  without touching anything an editor has already changed.

Deliberately **not** covered: button labels/links, table headers, and other
fixed UI chrome — this is "page settings," not a WordPress/Drupal-style page
builder, since the site has a bespoke fixed layout rather than a generic
content structure.

**Site-wide settings** (favicon, tagline, the navigation loading bar) reuse
this exact system as one more entry, `site`, in `PAGE_CONTENT_CONFIG` —
`adminOnly: true` restricts it to `/admin/pages/site`, visible only to the
`admin` role. The favicon is wired through `generateMetadata()` in the root
`layout.tsx`; the tagline replaces the header's hardcoded subtitle
(`Header.tsx`, threaded from `(site)/layout.tsx`); `loader_enabled` toggles
`RouteLoader.tsx`, a small top progress bar shown during route navigation.

**Important:** because everything on the public pages is meant to be
editable without a redeploy, `src/app/(site)/layout.tsx` exports
`export const dynamic = "force-dynamic"` — without it, Next would
statically prerender those pages at build time and admin edits wouldn't
appear on a real production build until the next deploy (`npm run dev`
doesn't show this, since dev mode never prerenders).

## Games editions (`/games`)

A per-edition micro-site — Paris 2024, Aichi-Nagoya, any future Games —
independent of the site-wide Athletes/Events/All-time-medals pages (which
stay untouched). Each edition has its own Delegation, Players, Events,
Results and Medals, reached via a "Games" dropdown in the header
(`Header.tsx`, portaled with `createPortal` so it isn't clipped by the
nav's `overflow-x-auto` scroll container — a real bug hit and fixed while
building this: an element can't overflow an ancestor whose `overflow-x` is
non-`visible`, since the browser then forces `overflow-y` to `auto` too).

- `game_editions` + five child tables (`game_edition_sports`,
  `_delegates`, `_players`, `_events`, `_medals`), all scoped by
  `game_edition_id`. `game_edition_events` covers **both** the Events and
  Results public pages — a row with `result_time`/`result_rank` filled in
  is a result, blank is still upcoming; there's no separate results table.
- Admin-side, this is the generic CRUD system (`resources.ts`/`crud.ts`)
  extended with one new concept: an optional `scopeField` on a
  `ResourceConfig`, so a resource's rows are filtered/injected by a parent
  id. `AdminResourceManager` takes a `scopeValue` prop and appends
  `?scope=` to its requests — everything else about it (forms, image
  upload, edit/delete) is unchanged. `game_editions` itself is a normal
  top-level (unscoped) resource with a `detailHref` config
  (`/admin/game_editions/{id}/manage`), which is what puts a
  "Manage content →" link on each row, leading to
  `src/app/admin/game_editions/[id]/manage/page.tsx` — five
  `AdminResourceManager`s, one per child resource, all scoped to that one
  edition.
- Public routes mirror the site's existing "real route per page" pattern
  rather than client-side tab-switching: `src/app/(site)/games/page.tsx`
  (index of published editions) and `.../games/[slug]/{delegation,players,
  events,results,medals}/page.tsx` under a shared `[slug]/layout.tsx` that
  404s on an unknown or unpublished slug and renders the edition
  banner + tab nav. Data access is `src/lib/data/games.ts`; medal totals
  reuse the existing `countMedals` helper (`src/lib/medals.ts`) rather than
  a new implementation, same "compute from leaf records" principle as the
  all-time medals table.
- `npm run seed:games` seeds one example edition (Paris 2024), content
  ported from the reference site shared when this feature was requested —
  placeholder, same verify-before-publishing caveat as the other seed data.

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
- `src/components/` — `layout/` (public chrome), `shared/` (ImageTile, Countdown, SectionHead), `admin/` (AdminSidebar, AdminResourceManager, MedalsManager, UsersManager), `games/` (GameEditionTabs, PlayerRoster, EventsList), and one folder per public-page domain (`home/`, `athletes/`, `medals/`, `events/`).
- `src/lib/data/*` — server-only Postgres query functions for the public site, one file per domain, including `pageContent.ts` and `games.ts`.
- `src/lib/admin/*` — the generic CRUD layer, resource config, page-content config, admin nav, and analytics queries.
- `src/components/analytics/Analytics.tsx` — the visitor-traffic beacon (public site only).
- `src/lib/db.ts` — the `pg` pool + `query`/`queryOne` helpers (no SSL — matches the single-VM Postgres-on-localhost hosting pattern used by this user's other Next.js projects).
- `src/lib/site.config.ts` — fixed structural constants (nav, footer links, filter chip labels, the LA2028 countdown target).
- `src/auth.ts` / `src/proxy.ts` — NextAuth config and the route proxy protecting `/admin`.
- `sql/schema.sql` — table definitions.
- `scripts/seed.ts` — seeds the sample public content ported from the design prototype.
- `scripts/seed-admin.ts` — creates/updates an admin login.
- `scripts/seed-games.ts` — seeds the example Paris 2024 Games edition.
