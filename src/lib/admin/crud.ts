import { pool, query, queryOne } from "@/lib/db";
import { type ResourceConfig, slugify } from "@/lib/admin/resources";

function coerceValue(type: string, raw: unknown) {
  if (type === "number") return raw === "" || raw === null || raw === undefined ? 0 : Number(raw);
  if (type === "boolean") return Boolean(raw);
  return raw ?? null;
}

async function uniqueSlug(table: string, base: string, excludeId?: number) {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 2;
  for (;;) {
    const existing = excludeId
      ? await queryOne(`SELECT id FROM ${table} WHERE slug = $1 AND id != $2`, [candidate, excludeId])
      : await queryOne(`SELECT id FROM ${table} WHERE slug = $1`, [candidate]);
    if (!existing) return candidate;
    candidate = `${root}-${n++}`;
  }
}

export async function listRows(resource: ResourceConfig) {
  const cols = ["id", ...resource.fields.map((f) => f.key)];
  if (resource.slugSource) cols.push("slug");
  const { rows } = await query(
    `SELECT ${cols.join(", ")} FROM ${resource.table} ORDER BY sort_order ASC, id ASC`
  );
  return rows;
}

export async function createRow(resource: ResourceConfig, body: Record<string, unknown>) {
  const cols: string[] = [];
  const values: unknown[] = [];

  for (const field of resource.fields) {
    if (field.key === "sort_order" && (body.sort_order === undefined || body.sort_order === "")) {
      const max = await queryOne<{ max: number | null }>(
        `SELECT MAX(sort_order) as max FROM ${resource.table}`
      );
      cols.push("sort_order");
      values.push((max?.max ?? -1) + 1);
      continue;
    }
    cols.push(field.key);
    values.push(coerceValue(field.type, body[field.key]));
  }

  if (resource.slugSource) {
    const base = String(body[resource.slugSource] ?? "item");
    cols.push("slug");
    values.push(await uniqueSlug(resource.table, base));
  }

  const placeholders = cols.map((_, i) => `$${i + 1}`);
  const { rows } = await query(
    `INSERT INTO ${resource.table} (${cols.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING id`,
    values
  );
  return rows[0];
}

export async function updateRow(resource: ResourceConfig, id: number, body: Record<string, unknown>) {
  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const field of resource.fields) {
    if (!(field.key in body)) continue;
    // Skip clearing an image field when no new upload was provided.
    if (field.type === "image" && (body[field.key] === undefined || body[field.key] === null)) continue;
    sets.push(`${field.key} = $${i++}`);
    values.push(coerceValue(field.type, body[field.key]));
  }

  if (resource.slugSource && resource.slugSource in body) {
    sets.push(`slug = $${i++}`);
    values.push(await uniqueSlug(resource.table, String(body[resource.slugSource]), id));
  }

  if (sets.length === 0) return;

  values.push(id);
  await pool.query(`UPDATE ${resource.table} SET ${sets.join(", ")} WHERE id = $${i}`, values);
}

export async function deleteRow(resource: ResourceConfig, id: number) {
  await pool.query(`DELETE FROM ${resource.table} WHERE id = $1`, [id]);
}
