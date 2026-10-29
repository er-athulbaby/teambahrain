import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, queryOne } from "@/lib/db";
import { requireAdmin, errorResponse, isUniqueViolation } from "@/lib/admin/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin({ adminOnly: true });
  if (error) return error;

  const { id } = await params;
  const { name, email, username, role, password, resetMfa } = await request.json();

  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (name !== undefined) {
    sets.push(`name = $${i++}`);
    values.push(name);
  }
  if (email !== undefined) {
    sets.push(`email = $${i++}`);
    values.push(email);
  }
  if (username !== undefined) {
    sets.push(`username = $${i++}`);
    values.push(username);
  }
  if (role !== undefined) {
    const validRoles = ["admin", "editor", "media", "sports_editor"];
    if (!validRoles.includes(role)) return errorResponse(`Role must be one of: ${validRoles.join(", ")}`);
    sets.push(`role = $${i++}`);
    values.push(role);
  }
  if (password) {
    if (password.length < 8) return errorResponse("Password must be at least 8 characters");
    sets.push(`password_hash = $${i++}`);
    values.push(await bcrypt.hash(password, 10));
  }
  if (resetMfa) {
    sets.push(`totp_secret = NULL`, `totp_enabled = false`);
  }

  if (sets.length === 0) return errorResponse("Nothing to update");

  values.push(id);
  try {
    await pool.query(`UPDATE admins SET ${sets.join(", ")} WHERE id = $${i}`, values);
  } catch (err) {
    if (isUniqueViolation(err)) return errorResponse("That username or email is already in use", 409);
    throw err;
  }
  return NextResponse.json({ ok: true });
}

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
