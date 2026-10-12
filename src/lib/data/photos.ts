import { query } from "@/lib/db";
import type { Photo } from "@/types";

export async function getPhotos() {
  const { rows } = await query<Photo>(
    `SELECT p.id, p.image_path, p.caption, p.game_edition_id, g.name AS game_edition_name
     FROM photos p LEFT JOIN game_editions g ON g.id = p.game_edition_id
     ORDER BY p.created_at DESC`
  );
  return rows;
}
