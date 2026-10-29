-- Adds Team Bahrain's own medals from the Aichi-Nagoya 2026 Asian Games
-- medal table (only the "Bahrain"-attributed rows, not other countries'
-- athletes shown alongside them in the same table). Idempotent — safe to
-- re-run; skips any row that already exists.

INSERT INTO game_edition_medals (game_edition_id, sport, event_name, athlete_name, medal, sort_order)
SELECT ge.id, 'Athletics', '4 x 400m Relay Mixed', 'Bahrain', 'G', 100
FROM game_editions ge WHERE ge.name ILIKE '%aichi%nagoya%'
AND NOT EXISTS (SELECT 1 FROM game_edition_medals m WHERE m.game_edition_id = ge.id AND m.sport = 'Athletics' AND m.event_name = '4 x 400m Relay Mixed' AND m.athlete_name = 'Bahrain');

INSERT INTO game_edition_medals (game_edition_id, sport, event_name, athlete_name, medal, sort_order)
SELECT ge.id, 'Athletics', 'Women''s 4 x 400m Relay', 'Bahrain', 'S', 101
FROM game_editions ge WHERE ge.name ILIKE '%aichi%nagoya%'
AND NOT EXISTS (SELECT 1 FROM game_edition_medals m WHERE m.game_edition_id = ge.id AND m.sport = 'Athletics' AND m.event_name = 'Women''s 4 x 400m Relay' AND m.athlete_name = 'Bahrain');

INSERT INTO game_edition_medals (game_edition_id, sport, event_name, athlete_name, medal, sort_order)
SELECT ge.id, 'Handball', 'Men', 'Bahrain', 'G', 102
FROM game_editions ge WHERE ge.name ILIKE '%aichi%nagoya%'
AND NOT EXISTS (SELECT 1 FROM game_edition_medals m WHERE m.game_edition_id = ge.id AND m.sport = 'Handball' AND m.event_name = 'Men' AND m.athlete_name = 'Bahrain');
