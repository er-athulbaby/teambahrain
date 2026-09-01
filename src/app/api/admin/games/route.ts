import { NextResponse } from "next/server";
import { pool, query, queryOne } from "@/lib/db";
import { requireAdmin, errorResponse, isUniqueViolation } from "@/lib/admin/api";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const games = await query(`SELECT id, year, city, sort_order FROM olympic_games ORDER BY sort_order ASC`);
  const medals = await query(
    `SELECT id, game_id, sport, event_name, athlete_name, medal FROM olympic_medals ORDER BY id ASC`
  );

  const withMedals = games.rows.map((g) => ({
    ...g,
    medals: medals.rows.filter((m) => m.game_id === g.id),
  }));

  return NextResponse.json(withMedals);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { year, city } = await request.json();
  if (!year || !city) return errorResponse("Year and city are required");

  const max = await queryOne<{ max: number | null }>(`SELECT MAX(sort_order) as max FROM olympic_games`);
  try {
    const result = await pool.query(
      `INSERT INTO olympic_games (year, city, sort_order) VALUES ($1, $2, $3) RETURNING id, year, city, sort_order`,
      [year, city, (max?.max ?? -1) + 1]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) return errorResponse(`A Games entry for ${year} already exists`, 409);
    throw err;
  }
}
