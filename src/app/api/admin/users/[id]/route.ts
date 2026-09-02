import { NextResponse } from "next/server";
import { pool, queryOne } from "@/lib/db";
import { requireAdmin, errorResponse } from "@/lib/admin/api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdmin({ adminOnly: true });
  if (error) return error;

  const { id } = await params;

  if (String(session.user.id) === id) {
    return errorResponse("You can't delete your own account while signed in as it");
  }

  const target = await queryOne<{ role: string }>(`SELECT role FROM admins WHERE id = $1`, [id]);
  if (!target) return errorResponse("User not found", 404);

  if (target.role === "admin") {
    const remaining = await queryOne<{ count: string }>(
      `SELECT COUNT(*) AS count FROM admins WHERE role = 'admin' AND id != $1`,
      [id]
    );
    if (Number(remaining?.count ?? 0) === 0) {
      return errorResponse("Can't delete the last remaining admin account");
    }
  }

  await pool.query(`DELETE FROM admins WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
