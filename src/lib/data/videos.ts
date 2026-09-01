import { query, queryOne } from "@/lib/db";
import type { Video } from "@/types";

export async function getFeatureVideo() {
  return queryOne<Video>(
    `SELECT id, slug, title, duration, series, photo_path, is_feature
     FROM videos WHERE is_feature = TRUE ORDER BY sort_order ASC LIMIT 1`
  );
}

export async function getVideoList() {
  const { rows } = await query<Video>(
    `SELECT id, slug, title, duration, series, photo_path, is_feature
     FROM videos WHERE is_feature = FALSE ORDER BY sort_order ASC`
  );
  return rows;
}
