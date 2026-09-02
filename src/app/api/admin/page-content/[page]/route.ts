import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { getPageConfig } from "@/lib/admin/pageContentConfig";
import { getPageContent } from "@/lib/data/pageContent";

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page } = await params;
  const config = getPageConfig(page);
  if (!config) return errorResponse("Unknown page", 404);

  const values = await getPageContent(page);
  return NextResponse.json(values);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { page } = await params;
  const config = getPageConfig(page);
  if (!config) return errorResponse("Unknown page", 404);

  const body = await request.json();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const field of config.fields) {
      if (!(field.key in body)) continue;
      const value = body[field.key];
      if (typeof value !== "string") continue;
      await client.query(
        `INSERT INTO page_content (page, field_key, value) VALUES ($1, $2, $3)
         ON CONFLICT (page, field_key) DO UPDATE SET value = EXCLUDED.value`,
        [page, field.key, value]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true });
}
