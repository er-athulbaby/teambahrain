import { query } from "@/lib/db";
import type { TimelineEntry, Legend } from "@/types";

export async function getTimeline() {
  const { rows } = await query<TimelineEntry>(
    `SELECT id, year, title, body FROM timeline_entries ORDER BY sort_order ASC`
  );
  return rows;
}

export async function getLegends() {
  const { rows } = await query<Legend>(
    `SELECT id, name, era, line, photo_path FROM legends ORDER BY sort_order ASC`
  );
  return rows;
}
