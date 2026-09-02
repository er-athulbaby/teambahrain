import "dotenv/config";
import { Pool } from "pg";
import { PAGE_CONTENT_CONFIG } from "../src/lib/admin/pageContentConfig";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  for (const [page, config] of Object.entries(PAGE_CONTENT_CONFIG)) {
    for (const field of config.fields) {
      await pool.query(
        `INSERT INTO page_content (page, field_key, value) VALUES ($1, $2, $3)
         ON CONFLICT (page, field_key) DO NOTHING`,
        [page, field.key, field.default]
      );
    }
  }

  console.log("Page content defaults seeded (existing values were left untouched).");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
