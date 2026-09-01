import { query } from "@/lib/db";
import type { Sport } from "@/types";

export async function getSports() {
  const { rows } = await query<Sport>(
    `SELECT id, slug, name, squads_label, note, photo_path FROM sports ORDER BY sort_order ASC`
  );
  return rows;
}
