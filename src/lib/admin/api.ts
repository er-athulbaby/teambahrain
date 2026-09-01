import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Postgres unique_violation error code. */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}
