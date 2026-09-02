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
    if (field.required && field.type !== "image" && !body[field.key]) {
      return errorResponse(`${field.label} is required`);
    }
  }

  const created = await createRow(resource, body, scope);
  return NextResponse.json(created, { status: 201 });
}
