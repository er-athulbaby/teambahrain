import { query } from "@/lib/db";
import type { OlympicGame, MedalRecord, ContinentalStat, MedalCounts } from "@/types";

export async function getOlympicGames() {
  const { rows } = await query<OlympicGame>(
    `SELECT id, year, city FROM olympic_games ORDER BY sort_order ASC`
  );
  return rows;
}

export async function getOlympicMedals() {
  const { rows } = await query<MedalRecord>(
    `SELECT m.game_id, g.year, g.city, m.sport, m.event_name, m.athlete_name, m.medal
     FROM olympic_medals m
     JOIN olympic_games g ON g.id = m.game_id
     ORDER BY g.sort_order ASC`
  );
  return rows;
}

export async function getMedalTotals(): Promise<MedalCounts> {
  const { rows } = await query<{ medal: string; count: string }>(
    `SELECT medal, COUNT(*) FROM olympic_medals GROUP BY medal`
  );
  const counts = { gold: 0, silver: 0, bronze: 0 };
  rows.forEach((r) => {
    const n = Number(r.count);
    if (r.medal === "G") counts.gold = n;
    else if (r.medal === "S") counts.silver = n;
    else counts.bronze = n;
  });
  return { ...counts, total: counts.gold + counts.silver + counts.bronze };
}

export async function getContinentalStats() {
  const { rows } = await query<ContinentalStat>(
    `SELECT id, value, label FROM continental_stats ORDER BY sort_order ASC`
  );
  return rows;
}
