import { NextResponse } from "next/server";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { pool, queryOne } from "@/lib/db";
import { deleteUpload } from "@/lib/s3";
import { canDeleteMediaLibraryItem } from "@/lib/admin/permissions";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  if (!canDeleteMediaLibraryItem(session.user.role)) {
    return errorResponse("This role can't delete media library items", 403);
  }

  const { id } = await params;
  const row = await queryOne<{ url: string }>(`SELECT url FROM media WHERE id = $1`, [id]);
  if (!row) return errorResponse("Not found", 404);

  await deleteUpload(row.url).catch(() => {
    // Best-effort — still remove the catalog entry even if the S3 object is already gone.
  });
  await pool.query(`DELETE FROM media WHERE id = $1`, [id]);

  return NextResponse.json({ ok: true });
}
