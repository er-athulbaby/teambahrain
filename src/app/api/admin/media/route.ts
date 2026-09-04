import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/api";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "image" | "video" | null

  const { rows } = await query(
    type
      ? `SELECT id, url, content_type, filename, created_at FROM media
         WHERE content_type LIKE $1 ORDER BY created_at DESC LIMIT 200`
      : `SELECT id, url, content_type, filename, created_at FROM media
         ORDER BY created_at DESC LIMIT 200`,
    type ? [`${type}/%`] : []
  );

  return NextResponse.json(rows);
}
