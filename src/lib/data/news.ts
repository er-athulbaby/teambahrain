import { query, queryOne } from "@/lib/db";
import type { NewsItem } from "@/types";

export async function getLeadNews() {
  return queryOne<NewsItem>(
    `SELECT id, slug, date, kicker, title, blurb, photo_path, is_lead
     FROM news WHERE is_lead = TRUE ORDER BY sort_order ASC LIMIT 1`
  );
}

export async function getNewsList() {
  const { rows } = await query<NewsItem>(
    `SELECT id, slug, date, kicker, title, blurb, photo_path, is_lead
     FROM news WHERE is_lead = FALSE ORDER BY sort_order ASC`
  );
  return rows;
}
