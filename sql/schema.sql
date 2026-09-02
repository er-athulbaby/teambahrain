-- Team Bahrain — schema
-- Roll-up values (medal totals, sport chips) are intentionally NOT stored here;
-- they are computed from olympic_medals at query time.

CREATE TABLE ticker_items (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE home_figures (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  note TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE athletes (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  event TEXT NOT NULL,
  line TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  squads_label TEXT NOT NULL,
  note TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  kicker TEXT NOT NULL,
  title TEXT NOT NULL,
  blurb TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  is_lead BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  series TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  video_path TEXT,
  is_feature BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  sports_label TEXT NOT NULL,
  status_label TEXT NOT NULL,
  status_type TEXT NOT NULL CHECK (status_type IN ('key', 'progress', 'confirmed')),
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE timeline_entries (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE legends (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  era TEXT NOT NULL,
  line TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE instagram_posts (
  id SERIAL PRIMARY KEY,
  likes TEXT NOT NULL,
  caption TEXT NOT NULL,
  photo_path TEXT NOT NULL,
  permalink TEXT NOT NULL DEFAULT 'https://www.instagram.com/',
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE olympic_games (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE olympic_medals (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES olympic_games(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  event_name TEXT NOT NULL,
  athlete_name TEXT NOT NULL,
  medal CHAR(1) NOT NULL CHECK (medal IN ('G', 'S', 'B'))
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE continental_stats (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Self-hosted visitor analytics. No IP address is stored — only what's
-- needed for aggregate traffic stats (views by page/day, top referrers).
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON page_views (created_at);
CREATE INDEX page_views_path_idx ON page_views (path);

-- One-off page copy/images (hero headlines, intros, feature photos) that
-- isn't a repeating content type. Key-value per page/field, resolved
-- against src/lib/admin/pageContentConfig.ts defaults when no row exists.
CREATE TABLE page_content (
  page TEXT NOT NULL,
  field_key TEXT NOT NULL,
  value TEXT,
  PRIMARY KEY (page, field_key)
);

-- Games editions (Paris 2024, Aichi-Nagoya, ...): an independent per-edition
-- micro-site (Delegation/Players/Events/Results/Medals), separate from the
-- olympic_games/olympic_medals tables used by the site-wide all-time medals
-- page. Medal totals here are computed from game_edition_medals leaf rows,
-- never stored, same principle as olympic_medals.
CREATE TABLE game_editions (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  edition_type TEXT NOT NULL,
  city TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  logo_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE game_edition_sports (
  id SERIAL PRIMARY KEY,
  game_edition_id INT NOT NULL REFERENCES game_editions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon_path TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE game_edition_delegates (
  id SERIAL PRIMARY KEY,
  game_edition_id INT NOT NULL REFERENCES game_editions(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL CHECK (group_name IN ('official', 'administrative')),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  photo_path TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE game_edition_players (
  id SERIAL PRIMARY KEY,
  game_edition_id INT NOT NULL REFERENCES game_editions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  photo_path TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE game_edition_events (
  id SERIAL PRIMARY KEY,
  game_edition_id INT NOT NULL REFERENCES game_editions(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  result_time TEXT,
  result_rank TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE game_edition_medals (
  id SERIAL PRIMARY KEY,
  game_edition_id INT NOT NULL REFERENCES game_editions(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  event_name TEXT NOT NULL,
  athlete_name TEXT NOT NULL,
  medal CHAR(1) NOT NULL CHECK (medal IN ('G', 'S', 'B')),
  sort_order INT NOT NULL DEFAULT 0
);
