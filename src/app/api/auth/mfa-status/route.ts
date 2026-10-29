import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { generateTotpSecret, totpQrDataUrl } from "@/lib/mfa";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/loginRateLimit";

// Checks username+password (without establishing a session) and tells the
// login form whether to ask for a TOTP code or walk the user through
// first-time setup. MFA is required for every admin role, so an account
// with no secret yet gets one generated (and persisted, but not enabled)
// here, the same way on every retry, so the QR doesn't change underneath
// a user who refreshes the page mid-setup.
export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  if (isRateLimited(username)) {
    return NextResponse.json({ error: "Too many attempts — try again in a few minutes." }, { status: 429 });
  }

  const { rows } = await pool.query(
    "SELECT id, username, password_hash, totp_secret, totp_enabled FROM admins WHERE username = $1",
    [username]
  );
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    recordFailedAttempt(username);
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  clearAttempts(username);

  if (admin.totp_enabled) {
    return NextResponse.json({ status: "needs_totp" });
  }

  let secret = admin.totp_secret as string | null;
  if (!secret) {
    secret = generateTotpSecret();
    await pool.query("UPDATE admins SET totp_secret = $1 WHERE id = $2", [secret, admin.id]);
  }
  const qrDataUrl = await totpQrDataUrl(admin.username, secret);
  return NextResponse.json({ status: "needs_setup", qrDataUrl, secret });
}
