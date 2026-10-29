-- Adds a live_url column to game_edition_events and links each of the 19
-- Team Bahrain Dakar 2026 events (already inserted by dakar_2026_data.sql)
-- to its matching Olympics.com session from the live-sessions CSV. Several
-- events share one broader session (e.g. all four Nov 4 Swimming heats map
-- to the single "Heats 4" session that covers that whole window).
-- Idempotent — safe to re-run.

ALTER TABLE game_edition_events ADD COLUMN IF NOT EXISTS live_url TEXT;

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-1-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s 100m Butterfly — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-01';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-and-men-s-fastest-heat-and-finals-1-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s 100m Butterfly — Final (if qualified) — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-01';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-2-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 100m Freestyle — Heats — Ali Husain Ali' AND e.event_date = '2026-11-02';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-and-men-s-finals-2-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 100m Freestyle — Final (if qualified) — Ali Husain Ali' AND e.event_date = '2026-11-02';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-4-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s 50m Freestyle — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-04';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-4-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 50m Freestyle — Heats — Ali Husain Ali' AND e.event_date = '2026-11-04';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-4-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s 50m Butterfly — Heats — Sara Mahdi AlQarooni' AND e.event_date = '2026-11-04';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/men-s-and-women-s-heats-4-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 50m Butterfly — Heats — Ali Husain Ali' AND e.event_date = '2026-11-04';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-and-men-s-finals-4-swimming-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = '50m Freestyle / 50m Butterfly — Finals (if qualified) — Sara Mahdi AlQarooni & Ali Husain Ali' AND e.event_date = '2026-11-04';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-45kg-65kg-men-s-70kg-90kg-group-stage-rounds-beach-wrestling-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 90kg — Official Weigh-in — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-pool-round-table-of-16-table-of-8-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Pool Round — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-pool-round-table-of-16-table-of-8-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Table of 16 (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-pool-round-table-of-16-table-of-8-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Table of 8 (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-45kg-65kg-men-s-70kg-90kg-group-stage-rounds-beach-wrestling-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 90kg — Group Stage Rounds 1–2 — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-semifinals-and-finals-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Semifinals (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-semifinals-and-finals-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Bronze Medal Bout (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-foil-ind-semifinals-and-finals-fencing-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Women''s Individual Foil — Gold Medal Bout (if qualified) — Ritej Haithem Salih Araoud' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-45kg-65kg-men-s-70kg-90kg-group-stage-rounds-and-finals-beach-wrestling-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 90kg — Group Stage Round 3 / Semifinals (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08';

UPDATE game_edition_events e SET live_url = 'https://www.olympics.com/en/dakar-2026/videos/women-s-45kg-65kg-men-s-70kg-90kg-group-stage-rounds-and-finals-beach-wrestling-dakar-2026-summer-youth-olympic-games'
FROM game_editions ge WHERE e.game_edition_id = ge.id AND ge.name ILIKE '%dakar%2026%'
AND e.title = 'Men''s 90kg — Final / Victory Ceremony (if qualified) — Ali Mohamed Ali Hasan Mohamed Zaman' AND e.event_date = '2026-11-08';
