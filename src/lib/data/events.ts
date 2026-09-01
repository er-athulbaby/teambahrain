import { query } from "@/lib/db";
import type { EventItem } from "@/types";

export async function getEvents() {
  const { rows } = await query<EventItem>(
    `SELECT id, date, name, city, sports_label, status_label, status_type
     FROM events ORDER BY sort_order ASC`
  );
  return rows;
}
