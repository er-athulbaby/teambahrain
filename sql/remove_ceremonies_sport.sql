-- Removes "Ceremonies" from the Sports tab/filter dropdown (both driven by
-- game_edition_sports) without touching the Opening/Closing Ceremony event
-- rows themselves — their sport column is free text, not a foreign key, so
-- they keep displaying "Ceremonies" as a label on the Events/Live pages.
DELETE FROM game_edition_sports
WHERE name = 'Ceremonies'
AND game_edition_id IN (SELECT id FROM game_editions WHERE name ILIKE '%dakar%2026%');
