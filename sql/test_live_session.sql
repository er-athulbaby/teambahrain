-- Temporary test row to verify inline video playback on the Live/Events
-- pages. Delete after testing: DELETE FROM game_edition_events WHERE
-- sport = 'Test' AND title = 'Test Live Session';
INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, live_url, sort_order)
SELECT ge.id, 'Test', 'Test Live Session', 'Test', CURRENT_DATE, 'Test',
  'https://www.olympics.com/en/dakar-2026/videos/mixed-cub-tur-and-tpe-sen-opening-round-baseball5-dakar-2026-summer-youth-olympic-games', 999
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Test Live Session');
