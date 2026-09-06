import { NextResponse } from "next/server";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { getResource } from "@/lib/admin/resources";
import { updateRow, deleteRow } from "@/lib/admin/crud";
import { canDeleteResource } from "@/lib/admin/permissions";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource: resourceKey, id } = await params;
  const { error } = await requireAdmin({ resourceKey });
  if (error) return error;

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
  const { resource: resourceKey, id } = await params;
  const { session, error } = await requireAdmin({ resourceKey });
  if (error) return error;

  const resource = getResource(resourceKey);
  if (!resource) return errorResponse("Unknown resource", 404);
  if (!canDeleteResource(session.user.role, resourceKey)) {
    return errorResponse("This role can't delete this resource", 403);
  }

  await deleteRow(resource, Number(id));
  return NextResponse.json({ ok: true });
}
