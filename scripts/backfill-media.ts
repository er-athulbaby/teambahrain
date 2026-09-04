import "dotenv/config";
import { Pool } from "pg";
import { RESOURCES } from "../src/lib/admin/resources";

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

function contentTypeFor(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase().split(/[?#]/)[0] ?? "";
  return EXT_TO_CONTENT_TYPE[ext] ?? "application/octet-stream";
}

function filenameFor(url: string): string {
  return url.split("/").pop() ?? url;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const urls = new Set<string>();

  // Every image/video field on every generic resource (athletes.photo_path,
  // game_editions.logo_path, videos.video_path, etc.) — only S3-hosted values,
  // never the site's own static /images/... or /boc-logo.png paths.
  for (const resource of Object.values(RESOURCES)) {
    for (const field of resource.fields) {
      if (field.type !== "image" && field.type !== "video") continue;
      const { rows } = await pool.query(
        `SELECT DISTINCT ${field.key} AS url FROM ${resource.table}
         WHERE ${field.key} LIKE '%.amazonaws.com%'`
      );
      for (const row of rows) if (row.url) urls.add(row.url);
    }
  }

  // Page content images (site logo/favicon, home hero photo, etc.) — same
  // table for every page, so one query covers all of them.
  const { rows: pageRows } = await pool.query(
    `SELECT DISTINCT value AS url FROM page_content WHERE value LIKE '%.amazonaws.com%'`
  );
  for (const row of pageRows) if (row.url) urls.add(row.url);

  let inserted = 0;
  for (const url of urls) {
    const result = await pool.query(
      `INSERT INTO media (url, content_type, filename) VALUES ($1, $2, $3)
       ON CONFLICT (url) DO NOTHING`,
      [url, contentTypeFor(url), filenameFor(url)]
    );
    if (result.rowCount) inserted++;
  }

  console.log(
    `Found ${urls.size} S3 file(s) already in use across the site — added ${inserted} new entr${
      inserted === 1 ? "y" : "ies"
    } to the Media Library (${urls.size - inserted} were already there).`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
