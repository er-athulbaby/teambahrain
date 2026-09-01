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

CREATE TABLE continental_stats (
  id SERIAL PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
