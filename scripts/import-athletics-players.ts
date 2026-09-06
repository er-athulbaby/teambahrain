import "dotenv/config";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { Pool } from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// One-time bulk import: BOC provided a folder per Aichi-Nagoya 2026
// athletics athlete (Men/Women subfolders), folder name = the athlete's
// full name, each folder holding a single photo under an unrelated
// filename (often Arabic or a random UUID) — hence taking the folder name,
// not the image name, as requested.
const SOURCE_DIR = "C:\\Users\\Athul Baby\\Downloads\\OneDrive_2026-09-06\\IT . Mohamed\\Athletics\\Athletes";
const EDITION_ID = 3; // Aichi-Nagoya 2026
const SPORT = "Athletics";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({ region: REGION });

async function main() {
  if (!REGION || !BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_REGION/AWS_S3_BUCKET/AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY must be set in .env");
  }

  const entries: { name: string; imagePath: string }[] = [];

  for (const genderDir of ["Men", "Women"]) {
    const genderPath = join(SOURCE_DIR, genderDir);
    const athleteFolders = readdirSync(genderPath, { withFileTypes: true }).filter((d) => d.isDirectory());

    for (const folder of athleteFolders) {
      const name = folder.name.replace(/\s+/g, " ").trim();
      const folderPath = join(genderPath, folder.name);
      const files = readdirSync(folderPath, { withFileTypes: true }).filter((f) => f.isFile());
      if (files.length === 0) {
        console.warn(`No image found for "${name}", skipping`);
        continue;
      }
      if (files.length > 1) {
        console.warn(`Multiple files for "${name}", using the first: ${files[0].name}`);
      }
      entries.push({ name, imagePath: join(folderPath, files[0].name) });
    }
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  let sortOrder = 1;
  for (const { name, imagePath } of entries) {
    const ext = imagePath.slice(imagePath.lastIndexOf(".")).toLowerCase();
    const contentType = CONTENT_TYPES[ext];
    if (!contentType) {
      console.warn(`Unrecognized extension for "${name}" (${imagePath}), skipping`);
      continue;
    }

    const buffer = readFileSync(imagePath);
    const key = `uploads/${randomUUID()}${ext}`;
    await s3.send(
      new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType })
    );
    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    await pool.query(
      `INSERT INTO media (url, content_type, filename) VALUES ($1, $2, $3) ON CONFLICT (url) DO NOTHING`,
      [publicUrl, contentType, imagePath.split(/[\\/]/).pop()]
    );

    await pool.query(
      `INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [EDITION_ID, name, SPORT, publicUrl, sortOrder]
    );

    console.log(`[${sortOrder}/${entries.length}] Uploaded + added: ${name}`);
    sortOrder++;
  }

  await pool.end();
  console.log(`Done. Added ${sortOrder - 1} Athletics players to edition ${EDITION_ID}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
