-- Remaining 19 of Team Bahrain's 22 Aichi-Nagoya 2026 medals (11G/5S/6B) —
-- the first 3 (both 4x400m relays + Handball) were already added by
-- aichi_nagoya_medals.sql. These athletes are Bahrain's own (naturalized)
-- medalists, nested under Bahrain's row in the official standings, not
-- other countries. Idempotent — safe to re-run.

INSERT INTO game_edition_medals (game_edition_id, sport, event_name, athlete_name, medal, sort_order)
SELECT v.ge_id, v.sport, v.event_name, v.athlete_name, v.medal, v.sort_order
FROM (
  SELECT ge.id AS ge_id, x.*
  FROM game_editions ge,
  (VALUES
    ('Athletics', 'Men''s 10,000m', 'BALEW Birhanu', 'G', 103),
    ('Athletics', 'Men''s 5000m', 'BALEW Birhanu', 'G', 104),
    ('Athletics', 'Women''s 10,000m', 'YAVI Winfred', 'G', 105),
    ('Athletics', 'Women''s 1500m', 'KORIR Nelly', 'G', 106),
    ('Athletics', 'Women''s 3000m Steeplechase', 'YAVI Winfred', 'G', 107),
    ('Athletics', 'Women''s 400m', 'NASER Salwa', 'G', 108),
    ('Athletics', 'Women''s 5000m', 'YAVI Winfred', 'G', 109),
    ('Athletics', 'Women''s Marathon', 'HABTE Shitaye', 'G', 110),
    ('Athletics', 'Women''s 800m', 'KORIR Nelly', 'S', 111),
    ('Athletics', 'Men''s 10,000m', 'KIPTOO Albert', 'B', 112),
    ('Athletics', 'Women''s 100m', 'ODIONG Edidiong', 'B', 113),
    ('Judo', 'Men -66 kg Final', 'BOQIEV Sukhrob', 'B', 114),
    ('Mixed Martial Arts', 'Men''s Traditional -77kg Final', 'NABIEV Muhammad', 'S', 115),
    ('Mixed Martial Arts', 'Women''s Modern -54kg Final', 'POGOSIAN Diana', 'S', 116),
    ('Swimming', 'Men''s 50m Butterfly', 'ARKHANGELSKIY Mikhail', 'G', 117),
    ('Weightlifting', 'Women''s 86kg All Groups', 'MARUSHCHAK Alina', 'S', 118),
    ('Weightlifting', 'Men''s +110kg All Groups', 'MINASYAN Gor', 'B', 119),
    ('Weightlifting', 'Women''s 69kg All Groups', 'GRUESO Ingrid', 'B', 120),
    ('Wrestling', 'Men''s Freestyle 125kg Final', 'SHARIPOV Shamil', 'B', 121)
  ) AS x(sport, event_name, athlete_name, medal, sort_order)
  WHERE ge.name ILIKE '%aichi%nagoya%'
) v
WHERE NOT EXISTS (
  SELECT 1 FROM game_edition_medals m
  WHERE m.game_edition_id = v.ge_id AND m.sport = v.sport AND m.event_name = v.event_name AND m.athlete_name = v.athlete_name
);
