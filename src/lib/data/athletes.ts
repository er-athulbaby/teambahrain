import { query } from "@/lib/db";
import type { Athlete } from "@/types";

export async function getAthletes() {
  const { rows } = await query<Athlete>(
    `SELECT id, slug, name, sport, event, line, photo_path, featured
     FROM athletes ORDER BY sort_order ASC`
  );
  return rows;
}
