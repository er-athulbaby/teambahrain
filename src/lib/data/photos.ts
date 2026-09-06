import { query } from "@/lib/db";
import type { Photo } from "@/types";

export async function getPhotos() {
  const { rows } = await query<Photo>(
    `SELECT id, image_path, caption FROM photos ORDER BY created_at DESC`
  );
  return rows;
}
