import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, errorResponse } from "@/lib/admin/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { sport, event_name, athlete_name, medal } = await request.json();
  if (!sport || !event_name || !athlete_name || !medal) {
    return errorResponse("Sport, event, athlete and medal are all required");
  }
  if (!["G", "S", "B"].includes(medal)) return errorResponse("Medal must be G, S or B");

  const result = await pool.query(
    `INSERT INTO olympic_medals (game_id, sport, event_name, athlete_name, medal)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, game_id, sport, event_name, athlete_name, medal`,
    [id, sport, event_name, athlete_name, medal]
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
