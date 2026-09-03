import { query } from "@/lib/db";
import type { HomeFigure, NewsItem, Athlete, InstagramPost } from "@/types";

export async function getTickerItems() {
  const { rows } = await query<{ text: string }>(
    `SELECT text FROM ticker_items ORDER BY sort_order ASC`
  );
  return rows.map((r) => r.text);
}

export async function getHomeFigures() {
  const { rows } = await query<HomeFigure>(
    `SELECT id, value, label, note FROM home_figures ORDER BY sort_order ASC`
  );
  return rows;
}

export async function getHomeNews() {
  const { rows } = await query<NewsItem>(
    `SELECT id, slug, date, kicker, title, blurb, photo_path, is_lead
     FROM news WHERE is_lead = FALSE ORDER BY sort_order ASC LIMIT 3`
  );
  return rows;
}

export async function getFeaturedAthletes() {
  const { rows } = await query<Athlete>(
    `SELECT id, slug, name, sport, event, line, photo_path, featured
     FROM athletes WHERE featured = TRUE ORDER BY sort_order ASC LIMIT 3`
  );
  return rows;
}

export async function getInstagramPosts() {
  const { rows } = await query<InstagramPost>(
    `SELECT id, reel_url FROM instagram_posts ORDER BY sort_order ASC`
  );
  return rows;
}
