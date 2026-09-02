import { query } from "@/lib/db";
import { getPageConfig } from "@/lib/admin/pageContentConfig";

export async function getPageContent(page: string): Promise<Record<string, string>> {
  const config = getPageConfig(page);
  if (!config) return {};

  const map: Record<string, string> = {};
  for (const field of config.fields) map[field.key] = field.default;

  const { rows } = await query<{ field_key: string; value: string | null }>(
    `SELECT field_key, value FROM page_content WHERE page = $1`,
    [page]
  );
  for (const row of rows) {
    if (row.value !== null) map[row.field_key] = row.value;
  }

  return map;
}
