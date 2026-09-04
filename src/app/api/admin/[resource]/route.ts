import { NextResponse } from "next/server";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { getResource } from "@/lib/admin/resources";
import { listRows, createRow } from "@/lib/admin/crud";

export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const resource = getResource((await params).resource);
  if (!resource) return errorResponse("Unknown resource", 404);

  const scope = new URL(request.url).searchParams.get("scope") ?? undefined;
  if (resource.scopeField && !scope) return errorResponse("Missing scope");

  const rows = await listRows(resource, scope);
  return NextResponse.json(rows);
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const resource = getResource((await params).resource);
  if (!resource) return errorResponse("Unknown resource", 404);

  const scope = new URL(request.url).searchParams.get("scope") ?? undefined;
  if (resource.scopeField && !scope) return errorResponse("Missing scope");

  const body = await request.json();
  for (const field of resource.fields) {
    if (!field.required || field.type === "image") continue;
    // In "year only" mode, body[field.key] (the exact date) is deliberately
    // blank — the year in the paired yearFieldKey satisfies "required" instead.
    if (field.type === "date_or_year") {
      const hasDate = Boolean(body[field.key]);
      const hasYear = field.yearFieldKey ? Boolean(body[field.yearFieldKey]) : false;
      if (!hasDate && !hasYear) return errorResponse(`${field.label} is required`);
      continue;
    }
    if (!body[field.key]) return errorResponse(`${field.label} is required`);
  }

  const created = await createRow(resource, body, scope);
  return NextResponse.json(created, { status: 201 });
}
