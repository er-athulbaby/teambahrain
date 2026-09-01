import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, errorResponse, isUniqueViolation } from "@/lib/admin/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { year, city } = await request.json();
  if (!year || !city) return errorResponse("Year and city are required");

  try {
    await pool.query(`UPDATE olympic_games SET year = $1, city = $2 WHERE id = $3`, [year, city, id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isUniqueViolation(err)) return errorResponse(`A Games entry for ${year} already exists`, 409);
    throw err;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await pool.query(`DELETE FROM olympic_games WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
