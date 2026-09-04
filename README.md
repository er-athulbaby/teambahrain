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
- AWS S3 for image/video storage, uploaded directly from the browser via presigned URLs
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

Image and video fields upload straight to S3 (presigned URL, see
[Uploads (S3)](#uploads-s3) below) and store the returned public URL on the
row. Older rows created before this change may still point at a local
`public/uploads/...` path — those keep working untouched, nothing migrates
existing files.

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

**Site-wide settings** (logo, favicon, tagline, the navigation loading bar,
the countdown target date) reuse this exact system as one more entry, `site`,
in `PAGE_CONTENT_CONFIG` — `adminOnly: true` restricts it to
`/admin/pages/site`, visible only to the `admin` role. The favicon is wired
through `generateMetadata()` in the root `layout.tsx`; the logo shows in the
admin sidebar (`AdminSidebar.tsx`) and on `/login` (`LoginForm.tsx`), falling
back to the default icon when empty; the tagline replaces the header's
hardcoded subtitle (`Header.tsx`, threaded from `(site)/layout.tsx`);
`loader_enabled` toggles `RouteLoader.tsx`; `games_date` (a `"date"` field —
a plain HTML date input, so it's UTC-midnight precision, not exact-hour) is
read by every `<Countdown targetDate={...}>` usage (`Hero.tsx` on Home,
`(site)/events/page.tsx`) instead of the old hardcoded `GAMES_DATE` constant
in `site.config.ts`, which now only serves as the fallback default.

The `home` page's config also carries three booleans —
`show_news_section`/`show_athletes_section`/`show_medals_section` — that
`(site)/page.tsx` checks (`!== "false"`, so they default on) to show or hide
the "Latest from the team", "Athletes to watch", and "All-time Olympic
medals" sections without touching code.

**Important:** because everything on the public pages is meant to be
editable without a redeploy, `src/app/(site)/layout.tsx` exports
`export const dynamic = "force-dynamic"` — without it, Next would
statically prerender those pages at build time and admin edits wouldn't
appear on a real production build until the next deploy (`npm run dev`
doesn't show this, since dev mode never prerenders). `/login` carries the
same export directly on its own `page.tsx` for the same reason (it sits
outside the `(site)` route group, so it doesn't inherit the layout's).

## Uploads (S3)

Every image and video upload in the admin panel goes directly from the
browser to S3 — file bytes never pass through the Next.js server. This
matters most for video: routing a large file through the server twice
(browser→server, server→S3) doesn't scale, so both images and videos share
one presigned-upload flow instead:

1. The browser asks `POST /api/admin/upload` for a presigned URL, sending
   just `{ filename, contentType }` (no file bytes).
2. `src/app/api/admin/upload/route.ts` checks the caller is an admin, checks
   `contentType` against an allowlist (`image/png`, `image/jpeg`,
   `image/webp`, `video/mp4`, `video/webm`, `video/quicktime`), and calls
   `createPresignedUpload()` in `src/lib/s3.ts` to generate an
   `uploads/<uuid>.<ext>` object key and a short-lived (5 min) presigned S3
   `PutObject` URL.
3. `src/lib/admin/uploadClient.ts`'s `uploadFile()` — the one function both
   `AdminResourceManager.tsx` and `PageContentManager.tsx` call for every
   image/video field — `fetch`es that presigned URL with `PUT` and the raw
   `File`, directly against S3, then returns the public URL to store on the
   row. It also enforces client-side size limits (8MB images, 500MB videos)
   before starting, since a presigned PUT has no server-side size check the
   way a buffered upload would.

**Required environment variables** (`.env`, never committed):

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

Until all four are set, `isS3Configured()` returns false and the upload
route responds `503` with a message explaining what's missing — the admin
form surfaces that inline instead of failing silently.

**What the S3 bucket needs** (see `.env.example` for the same summary):

- Bucket policy allowing public `s3:GetObject` on the `uploads/*` prefix
  only — "Block all public access" should otherwise stay on.
- CORS allowing `PUT` from the app's origin(s) (`http://localhost:3000` in
  dev, plus the production domain), since the upload goes browser → S3
  directly.
- An IAM user/role whose only permission is `s3:PutObject` on
  `arn:aws:s3:::<bucket>/uploads/*`, used for `AWS_ACCESS_KEY_ID` /
  `AWS_SECRET_ACCESS_KEY`.

`next.config.ts` allows `next/image` to optimize the resulting
`https://<bucket>.s3.<region>.amazonaws.com/...` URLs via a
`**.amazonaws.com` `remotePatterns` entry — worth narrowing to the exact
bucket hostname once it's finalized in production.

**Media Library** (`/admin/media`): every upload is recorded into a `media`
table (`url`, `content_type`, `filename`) at presign time in
`/api/admin/upload/route.ts` — the one point that knows about the upload at
all, since the actual file `PUT` goes straight from the browser to S3 and
never touches this server. The library page (`MediaLibrary.tsx`) lists
everything ever uploaded with its own upload button and delete (which also
calls `deleteUpload()` in `src/lib/s3.ts` to remove the underlying S3
object — deleting something still referenced elsewhere will break that
image/video, there's no reference tracking). Every image/video field across
`AdminResourceManager.tsx` and `PageContentManager.tsx` gets a second
"Library" button next to "Choose image/video", opening `MediaPickerModal.tsx`
(portaled, same reason as the header's Games dropdown) to reuse an existing
file instead of re-uploading a duplicate. `media.url` is `UNIQUE`, so both the
upload route's insert and the backfill script below use
`ON CONFLICT (url) DO NOTHING` and are safe to run more than once.

Uploads made *before* this table existed were never catalogued anywhere —
`npm run backfill:media` (`scripts/backfill-media.ts`) finds them after the
fact by scanning every `image`/`video` field on every resource
(`resources.ts`) plus every `page_content` value for anything hosted on
`amazonaws.com`, then inserts whatever isn't already in `media` (content
type and filename inferred from the URL, since that's all a pre-existing
reference gives you). Run it once after deploying this feature to a site
that already has real uploads.

**Video playback**: the `videos` resource has an optional `video_path`
alongside the existing `photo_path` thumbnail (`sql/schema.sql`,
`resources.ts`). On the public Videos page, `FeatureVideo.tsx` and
`VideoGridTile.tsx` (both client components, since they hold play/pause
state) render the thumbnail as-is when a row has no `video_path` — identical
to the site's original thumbnail-only behavior — and swap in a real
`<video controls autoPlay>` element on click when one is set.

## Instagram (Home page)

The home page's Instagram section embeds real Instagram reels rather than
static photo tiles. The `instagram_posts` admin resource
(`/admin/instagram_posts`) has a single required field, `reel_url` — the
full `instagram.com/reel/...` or `.../p/...` link, nothing else to fill in.
`InstagramGrid.tsx` extracts the shortcode from that URL
(`/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/`) and renders each as an
`<iframe src="https://www.instagram.com/reel/<code>/embed/">` in a 9:16 tile
— Instagram's public embed endpoint needs no API key, no app registration,
and no script tag. Rows with a URL that doesn't match are skipped, and the
whole section renders nothing (not an empty header) when there's nothing
embeddable. This deliberately doesn't attempt real Instagram API integration
(Graph API tokens, refresh flows) since the public embed endpoint covers the
"show our real reels" requirement without that overhead.

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
- `start_date`/`end_date` are nullable, each paired with a `start_year`/
  `end_year` fallback for a future edition whose exact dates aren't
  announced yet — exactly one of the pair should be set at a time. This is
  the generic resource system's `"date_or_year"` field type
  (`resources.ts`): `AdminResourceManager` renders an exact-date input with
  a "year only" checkbox that swaps it for a plain year number instead,
  writing into the field's declared `yearFieldKey`. The year column itself
  is a separate `"year"` field marked `hiddenInForm` — present in
  `resource.fields` so `crud.ts` reads/writes it, but not rendered as its
  own row (the `date_or_year` field's UI covers both). `"year"` exists
  because plain `"number"` fields default an empty value to `0` (correct
  for `sort_order`, wrong for "no year set" — that must stay `null`).
  Every public date display goes through `formatEditionDate()`
  (`src/lib/formatEditionDate.ts`), falling back to the bare year, and
  `/games`, `/calendar` and the Home page all order editions by the
  existing `sort_order` rather than by date, since a year-only edition
  has nothing reliable to sort against.
- **A real bug found and fixed while building this**: `pg`'s default
  `DATE` column parser returns a JS `Date` object, which serializes with
  the *server's* timezone offset applied — silently shifting the stored
  calendar date by a day on round-trip, and producing a value
  `<input type="date">` can't parse at all (it requires exactly
  `"YYYY-MM-DD"`, not a full ISO timestamp), so an edit form's date
  fields rendered blank. `src/lib/db.ts` now registers
  `types.setTypeParser(1082, (v) => v)` (OID 1082 = Postgres `date`) so
  `pg` returns the raw wire string instead — fixes both problems at the
  root, for every `DATE` column site-wide, not just `game_editions`.
- **Status** replaces the old `is_published` boolean with a three-way
  `status` (`"draft" | "announced" | "live"`, a plain `select` field with
  a `CHECK` constraint) — for a future edition whose Delegation/Sports/
  Players aren't set up yet: `draft` stays fully hidden (the old
  `is_published = false`); `announced` shows on `/calendar` and the Home
  page's Calendar section, card/row not a link (see `GameEditionCard.tsx`,
  `CalendarRow.tsx` — both branch on `edition.status === "live"` between
  rendering a `<Link>` or a plain `<div>` with identical styling, no
  visible difference); `live` is the old `is_published = true`. Kept as
  one field rather than a second checkbox specifically so "announced but
  somehow still a link" can't happen. `getEditionBySlug()` (used only by
  the micro-site's own `/games/[slug]/...` routes) requires `status =
  'live'` strictly, so an announced edition's micro-site 404s even by
  direct URL — same as a hidden draft one. The header's Games dropdown
  filters to `live` only, for the same reason.
- **`/games` vs `/calendar` now read from two different queries**
  (`src/lib/data/games.ts`): `getLiveEditions()` (`status = 'live'` only)
  backs `/games` and its Home preview — the permanent directory of every
  edition with real content, past and upcoming alike, so a completed one
  like Paris 2024 never disappears. `getPublishedEditions()` (`status IN
  ('announced', 'live')`, unfiltered by date) backs `/calendar` and its
  Home preview — an announced edition only ever shows there until it goes
  live, at which point it appears on both.
- The "Manage content" page (`admin/game_editions/[id]/manage/page.tsx`)
  orders its five `AdminResourceManager`s Delegation → **Sports** →
  Players → Events & Results → Medals — Sports has to come before
  Players since Players' `"sport"` field is a dropdown fed from that
  edition's own Sports list (each with its own icon).
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
- The `sport` field on Players/Events/Medals is a `"sport"` field type
  (`resources.ts`), not free text — `AdminResourceManager` fetches that
  edition's own `game_edition_sports` list (`?scope=`) and renders it as a
  dropdown, so the stored name can't drift from what the sport
  filter/icons on the public pages match against. Still just a plain TEXT
  column underneath — no schema change, no migration — the dropdown only
  narrows what the admin can type.
- Public routes mirror the site's existing "real route per page" pattern
  rather than client-side tab-switching: `src/app/(site)/games/page.tsx`
  (index of published editions) and `.../games/[slug]/{delegation,sports,
  players,events,results,medals}/page.tsx` under a shared `[slug]/layout.tsx`
  that 404s on an unknown/draft/announced slug and renders the edition
  banner + tab nav (`GameEditionTabs.tsx`, in that same order — Sports
  before Players since Players filters by that same list). The Sports tab
  is a static name+icon grid straight off `game_edition_sports`, deliberately
  not linked to anything (no filtered Players/Events jump) — just "here's
  what we're competing in this edition." Data access is
  `src/lib/data/games.ts`; medal totals
  reuse the existing `countMedals` helper (`src/lib/medals.ts`) rather than
  a new implementation, same "compute from leaf records" principle as the
  all-time medals table.
- `npm run seed:games` seeds one example edition (Paris 2024), content
  ported from the reference site shared when this feature was requested —
  placeholder, same verify-before-publishing caveat as the other seed data.
- `/calendar` — a second view over the exact same `game_editions` data as
  `/games` (same `getPublishedEditions()`, no new table), sorted
  chronologically by `start_date` rather than the admin-set `sort_order`,
  styled after a reference NOC calendar page the user shared but rebuilt in
  Team Bahrain's own design language rather than copying that site's look.
  Keyword search and a year-range slider (also in that reference) were
  deliberately left out of this first pass, pending real usage. The row
  markup itself (`CalendarRow.tsx`) lives under `src/components/games/`
  rather than inside the page, since the Home page's own Calendar preview
  (`CalendarPreview.tsx`, next 3 upcoming, gated by
  `show_calendar_section`) reuses it rather than duplicating the JSX.

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
- `src/lib/admin/*` — the generic CRUD layer, resource config, page-content config, admin nav, analytics queries, and `uploadClient.ts` (shared browser→S3 upload helper).
- `src/lib/s3.ts` — the S3 client and presigned-upload URL generation used by `/api/admin/upload`.
- `src/components/videos/*` — `FeatureVideo.tsx` / `VideoGridTile.tsx`, the client components that swap a video thumbnail for real playback when a row has a `video_path`.
- `src/components/analytics/Analytics.tsx` — the visitor-traffic beacon (public site only).
- `src/lib/db.ts` — the `pg` pool + `query`/`queryOne` helpers (no SSL — matches the single-VM Postgres-on-localhost hosting pattern used by this user's other Next.js projects).
- `src/lib/site.config.ts` — fixed structural constants (header nav items, footer links, filter chip labels, the countdown's fallback default date).
- `src/auth.ts` / `src/proxy.ts` — NextAuth config and the route proxy protecting `/admin`.
- `sql/schema.sql` — table definitions.
- `scripts/seed.ts` — seeds the sample public content ported from the design prototype.
- `scripts/seed-admin.ts` — creates/updates an admin login.
- `scripts/seed-games.ts` — seeds the example Paris 2024 Games edition.
