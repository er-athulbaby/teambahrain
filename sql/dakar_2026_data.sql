-- Team Bahrain @ Dakar 2026: sports, players (with S3 photo match if one
-- already exists in the media library), and schedule events from the
-- "Team Bahrain in Dakar-2026.pdf" (Nov 1, 2, 4, 8 pages). Idempotent —
-- safe to re-run.

-- Sports
INSERT INTO game_edition_sports (game_edition_id, name, sort_order)
SELECT ge.id, 'Swimming', 1 FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_sports s WHERE s.game_edition_id = ge.id AND s.name = 'Swimming');

INSERT INTO game_edition_sports (game_edition_id, name, sort_order)
SELECT ge.id, 'Beach Wrestling', 2 FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_sports s WHERE s.game_edition_id = ge.id AND s.name = 'Beach Wrestling');

INSERT INTO game_edition_sports (game_edition_id, name, sort_order)
SELECT ge.id, 'Fencing', 3 FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_sports s WHERE s.game_edition_id = ge.id AND s.name = 'Fencing');

-- Players (photo_path pulled from an existing media-library photo whose
-- caption mentions the athlete's name, if any — otherwise left NULL and
-- can be set later from Admin > Players using the Library/URL/Upload picker)
INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
SELECT ge.id, 'Sara Mahdi AlQarooni', 'Swimming',
  (SELECT image_path FROM photos WHERE caption ILIKE '%Sara Mahdi%' OR caption ILIKE '%AlQarooni%' ORDER BY id DESC LIMIT 1), 1
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_players p WHERE p.game_edition_id = ge.id AND p.name = 'Sara Mahdi AlQarooni');

INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
SELECT ge.id, 'Ali Husain Ali', 'Swimming',
  (SELECT image_path FROM photos WHERE caption ILIKE '%Ali Husain Ali%' ORDER BY id DESC LIMIT 1), 2
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_players p WHERE p.game_edition_id = ge.id AND p.name = 'Ali Husain Ali');

INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
SELECT ge.id, 'Ali Mohamed Ali Hasan Mohamed Zaman', 'Beach Wrestling',
  (SELECT image_path FROM photos WHERE caption ILIKE '%Ali Mohamed Ali Hasan%' OR caption ILIKE '%Mohamed Zaman%' ORDER BY id DESC LIMIT 1), 3
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_players p WHERE p.game_edition_id = ge.id AND p.name = 'Ali Mohamed Ali Hasan Mohamed Zaman');

INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
SELECT ge.id, 'Ritej Haithem Salih Araoud', 'Fencing',
  (SELECT image_path FROM photos WHERE caption ILIKE '%Ritej%' OR caption ILIKE '%Araoud%' ORDER BY id DESC LIMIT 1), 4
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_players p WHERE p.game_edition_id = ge.id AND p.name = 'Ritej Haithem Salih Araoud');

-- Events & results (schedule only — "(if qualified)" rounds included as-is,
-- matching the PDF; opponent_country left blank, these are individual events)
INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Women''s 100m Butterfly — Heats — Sara Mahdi AlQarooni', 'Dakar Aquatic Centre (CAD)', '2026-11-01', '14:00–16:00 BH / 11:00–13:00 Dakar', 1
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s 100m Butterfly — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-01');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Women''s 100m Butterfly — Final (if qualified) — Sara Mahdi AlQarooni', 'Dakar Aquatic Centre (CAD)', '2026-11-01', '18:00–20:00 BH / 15:00–17:00 Dakar', 2
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s 100m Butterfly — Final (if qualified) — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-01');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Men''s 100m Freestyle — Heats — Ali Husain Ali', 'Dakar Aquatic Centre (CAD)', '2026-11-02', '14:00–16:00 BH / 11:00–13:00 Dakar', 3
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 100m Freestyle — Heats — Ali Husain Ali' AND e.event_date = '2026-11-02');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Men''s 100m Freestyle — Final (if qualified) — Ali Husain Ali', 'Dakar Aquatic Centre (CAD)', '2026-11-02', '18:00–20:00 BH / 15:00–17:00 Dakar', 4
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 100m Freestyle — Final (if qualified) — Ali Husain Ali' AND e.event_date = '2026-11-02');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Women''s 50m Freestyle — Heats — Sara Mahdi AlQarooni', 'Dakar Aquatic Centre (CAD)', '2026-11-04', '14:00–16:00 BH / 11:00–13:00 Dakar', 5
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s 50m Freestyle — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-04');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Men''s 50m Freestyle — Heats — Ali Husain Ali', 'Dakar Aquatic Centre (CAD)', '2026-11-04', '14:00–16:00 BH / 11:00–13:00 Dakar', 6
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 50m Freestyle — Heats — Ali Husain Ali' AND e.event_date = '2026-11-04');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Women''s 50m Butterfly — Heats — Sara Mahdi AlQarooni', 'Dakar Aquatic Centre (CAD)', '2026-11-04', '14:00–16:00 BH / 11:00–13:00 Dakar', 7
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s 50m Butterfly — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-04');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', 'Men''s 50m Butterfly — Heats — Ali Husain Ali', 'Dakar Aquatic Centre (CAD)', '2026-11-04', '14:00–16:00 BH / 11:00–13:00 Dakar', 8
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 50m Butterfly — Heats — Ali Husain Ali' AND e.event_date = '2026-11-04');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Swimming', '50m Freestyle / 50m Butterfly — Finals (if qualified) — Sara Mahdi AlQarooni & Ali Husain Ali', 'Dakar Aquatic Centre (CAD)', '2026-11-04', '18:00–20:00 BH / 15:00–17:00 Dakar', 9
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = '50m Freestyle / 50m Butterfly — Finals (if qualified) — Sara Mahdi AlQarooni & Ali Husain Ali' AND e.event_date = '2026-11-04');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Beach Wrestling', 'Men''s 90kg — Official Weigh-in — Ali Mohamed Ali Hasan Mohamed Zaman', 'Youth Olympic Village (YOV)', '2026-11-08', '10:30–11:00 BH / 07:30–08:00 Dakar', 10
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 90kg — Official Weigh-in — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Pool Round — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '12:00–13:45 BH / 09:00–10:45 Dakar', 11
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Pool Round — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Table of 16 (if qualified) — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '14:15–14:55 BH / 11:15–11:55 Dakar', 12
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Table of 16 (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Table of 8 (if qualified) — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '15:15–15:35 BH / 12:15–12:35 Dakar', 13
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Table of 8 (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Beach Wrestling', 'Men''s 90kg — Group Stage Rounds 1–2 — Ali Mohamed Ali Hasan Mohamed Zaman', 'Saly Beach West — Beach Court', '2026-11-08', '13:30–15:30 BH / 10:30–12:30 Dakar', 14
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 90kg — Group Stage Rounds 1–2 — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Semifinals (if qualified) — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '17:00–17:40 BH / 14:00–14:40 Dakar', 15
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Semifinals (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Bronze Medal Bout (if qualified) — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '18:00–18:20 BH / 15:00–15:20 Dakar', 16
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Bronze Medal Bout (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Fencing', 'Women''s Individual Foil — Gold Medal Bout (if qualified) — Ritej Haithem Salih Araoud', 'Dakar Expo Centre — Pavilion A', '2026-11-08', '18:30–18:50 BH / 15:30–15:50 Dakar', 17
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Women''s Individual Foil — Gold Medal Bout (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Beach Wrestling', 'Men''s 90kg — Group Stage Round 3 / Semifinals (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman', 'Saly Beach West — Beach Court', '2026-11-08', '18:00–20:30 BH / 15:00–17:30 Dakar', 18
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 90kg — Group Stage Round 3 / Semifinals (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, sort_order)
SELECT ge.id, 'Beach Wrestling', 'Men''s 90kg — Final / Victory Ceremony (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman', 'Saly Beach West — Beach Court', '2026-11-08', '20:30–21:30 BH / 17:30–18:30 Dakar', 19
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Men''s 90kg — Final / Victory Ceremony (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08');
