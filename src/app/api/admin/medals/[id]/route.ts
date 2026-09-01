import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, errorResponse } from "@/lib/admin/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { sport, event_name, athlete_name, medal } = await request.json();
  if (!sport || !event_name || !athlete_name || !medal) {
    return errorResponse("Sport, event, athlete and medal are all required");
  }
  if (!["G", "S", "B"].includes(medal)) return errorResponse("Medal must be G, S or B");

  await pool.query(
    `UPDATE olympic_medals SET sport = $1, event_name = $2, athlete_name = $3, medal = $4 WHERE id = $5`,
    [sport, event_name, athlete_name, medal, id]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await pool.query(`DELETE FROM olympic_medals WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
