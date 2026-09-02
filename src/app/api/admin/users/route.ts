import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, query } from "@/lib/db";
import { requireAdmin, errorResponse, isUniqueViolation } from "@/lib/admin/api";

export async function GET() {
  const { error } = await requireAdmin({ adminOnly: true });
  if (error) return error;

  const { rows } = await query(
    `SELECT id, name, email, username, role, created_at FROM admins ORDER BY created_at ASC`
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin({ adminOnly: true });
  if (error) return error;

  const { name, email, username, password, role } = await request.json();
  if (!name || !email || !username || !password) {
    return errorResponse("Name, email, username and password are all required");
  }
  if (password.length < 8) return errorResponse("Password must be at least 8 characters");
  if (role !== "admin" && role !== "editor") return errorResponse("Role must be admin or editor");

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO admins (name, email, username, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, username, role, created_at`,
      [name, email, username, passwordHash, role]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) return errorResponse("That username or email is already in use", 409);
    throw err;
  }
}
