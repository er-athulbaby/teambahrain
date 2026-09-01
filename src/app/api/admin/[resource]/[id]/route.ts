import { NextResponse } from "next/server";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { getResource } from "@/lib/admin/resources";
import { updateRow, deleteRow } from "@/lib/admin/crud";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { resource: resourceKey, id } = await params;
  const resource = getResource(resourceKey);
  if (!resource) return errorResponse("Unknown resource", 404);

  const body = await request.json();
  await updateRow(resource, Number(id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { resource: resourceKey, id } = await params;
  const resource = getResource(resourceKey);
  if (!resource) return errorResponse("Unknown resource", 404);

  await deleteRow(resource, Number(id));
  return NextResponse.json({ ok: true });
}
