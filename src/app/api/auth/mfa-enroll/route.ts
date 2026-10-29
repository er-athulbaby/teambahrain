import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { verifyTotp } from "@/lib/mfa";

// Confirms the admin actually scanned the QR from /api/auth/mfa-status by
// requiring one valid code before turning totp_enabled on. Re-checks the
// password too, since this endpoint (like that one) doesn't sit behind a
// session yet.
export async function POST(request: Request) {
  const { username, password, totp } = await request.json();
  if (typeof username !== "string" || typeof password !== "string" || typeof totp !== "string") {
    return NextResponse.json({ error: "Username, password and code are required" }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT id, password_hash, totp_secret, totp_enabled FROM admins WHERE username = $1",
    [username]
  );
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  if (admin.totp_enabled) {
    return NextResponse.json({ error: "MFA is already enabled on this account" }, { status: 400 });
  }
  if (!admin.totp_secret || !verifyTotp(admin.totp_secret, totp)) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  await pool.query("UPDATE admins SET totp_enabled = true WHERE id = $1", [admin.id]);
  return NextResponse.json({ ok: true });
}
