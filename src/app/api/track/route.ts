import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

function classifyDevice(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobi|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  let body: { path?: unknown; referrer?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 300) : null;
  if (!path || !path.startsWith("/")) return NextResponse.json({ ok: false }, { status: 400 });

  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 300) || null : null;
  const device = classifyDevice(request.headers.get("user-agent"));

  await pool.query(`INSERT INTO page_views (path, referrer, device) VALUES ($1, $2, $3)`, [
    path,
    referrer,
    device,
  ]);

  return NextResponse.json({ ok: true });
}
