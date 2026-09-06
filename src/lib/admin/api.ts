import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessResource } from "@/lib/admin/permissions";

export async function requireAdmin(options?: { adminOnly?: boolean; resourceKey?: string }) {
  const session = await auth();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (options?.adminOnly && session.user.role !== "admin") {
    return { session: null, error: NextResponse.json({ error: "Admins only" }, { status: 403 }) };
  }
  if (options?.resourceKey && !canAccessResource(session.user.role, options.resourceKey)) {
    return { session: null, error: NextResponse.json({ error: "Not permitted for this role" }, { status: 403 }) };
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
