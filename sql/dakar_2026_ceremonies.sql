-- Adds Opening/Closing Ceremony as events with a live_url (from the
-- Olympics.com live-sessions CSV), so they show up on the public Live page
-- alongside Team Bahrain's own events. Idempotent — safe to re-run.

INSERT INTO game_edition_sports (game_edition_id, name, sort_order)
SELECT ge.id, 'Ceremonies', 4 FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_sports s WHERE s.game_edition_id = ge.id AND s.name = 'Ceremonies');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, live_url, sort_order)
SELECT ge.id, 'Ceremonies', 'Opening Ceremony', 'Dakar, Senegal', '2026-10-31', '21:25–01:02 (+1 day) BH / 18:25–22:02 Dakar',
  'https://www.olympics.com/en/dakar-2026/videos/opening-ceremony-dakar-2026-summer-youth-olympic-games', 20
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Opening Ceremony' AND e.event_date = '2026-10-31');

INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, live_url, sort_order)
SELECT ge.id, 'Ceremonies', 'Closing Ceremony', 'Dakar, Senegal', '2026-11-13', '20:55–23:32 BH / 17:55–20:32 Dakar',
  'https://www.olympics.com/en/dakar-2026/videos/closing-ceremony-dakar-2026-summer-youth-olympic-games', 21
FROM game_editions ge WHERE ge.name ILIKE '%dakar%2026%'
AND NOT EXISTS (SELECT 1 FROM game_edition_events e WHERE e.game_edition_id = ge.id AND e.title = 'Closing Ceremony' AND e.event_date = '2026-11-13');
