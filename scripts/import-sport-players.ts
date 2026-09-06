import "dotenv/config";
import { readdirSync, readFileSync, renameSync, existsSync } from "fs";
import { join, extname, dirname } from "path";
import { randomUUID } from "crypto";
import { Pool } from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// One-time bulk import: BOC provided a folder per athlete (Men/Women or flat,
// varies by sport), folder name = the athlete's full name, each folder
// holding a single photo under an unrelated filename. Mirrors
// import-athletics-players.ts, generalized to loop over every remaining
// sport in one pass and to also rename the original photo file to match
// the athlete's name, as requested.
const ROOT_DIR = "C:\\Users\\Athul Baby\\Downloads\\OneDrive_2026-09-06\\IT . Mohamed";
const EDITION_NAME_PATTERN = "Aichi-Nagoya"; // matches both "Aichi-Nagoya 2026" (local) and "20th Asian Games Aichi-Nagoya 2026" (production)

// Folder name -> exact game_edition_sports.name, confirmed with the user
// where they didn't match automatically (Cycling, E-Sport, Mixed Martial
// Arts) or only differed by spacing/hyphen (Jiu Jitsu, Equestrian Dressage).
const SPORT_FOLDER_TO_DB_NAME: Record<string, string> = {
  Badminton: "Badminton",
  Basketball: "Basketball",
  "Basketball 3x3": "Basketball 3x3",
  Boxing: "Boxing",
  Cycling: "Cycling Road",
  "E-Sport": "E-Sports",
  "Equestrian  Dressage": "Equestrian Dressage",
  Handball: "Handball",
  "Jiu Jitsu": "Jiu-Jitsu",
  Judo: "Judo",
  Kurash: "Kurash",
  "Mixed Martial Arts": "MMA",
  Shooting: "Shooting",
  Swimming: "Swimming",
  "Table Tennis": "Table Tennis",
  Taekwondo: "Taekwondo",
  Triathlon: "Triathlon",
  Weightlifting: "Weightlifting",
  Wrestling: "Wrestling",
};

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({ region: REGION });

interface AthleteEntry {
  name: string;
  imagePath: string;
}

/** Recursively finds "leaf" directories (no subdirectories) under `dir` —
 * these are athlete folders, whether directly under Athletes/ or nested
 * one level deeper under Men/Women. */
function findAthleteFolders(dir: string): AthleteEntry[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());

  if (subdirs.length === 0) {
    const files = entries.filter((e) => e.isFile());
    if (files.length === 0) return [];
    if (files.length > 1) {
      console.warn(`Multiple files in "${dir}", using the first: ${files[0].name}`);
    }
    const name = dir
      .split(/[\\/]/)
      .pop()!
      .replace(/\s+/g, " ")
      .trim();
    return [{ name, imagePath: join(dir, files[0].name) }];
  }

  return subdirs.flatMap((d) => findAthleteFolders(join(dir, d.name)));
}

async function main() {
  if (!REGION || !BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_REGION/AWS_S3_BUCKET/AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY must be set in .env");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const editionRes = await pool.query(`SELECT id FROM game_editions WHERE name LIKE $1`, [
    `%${EDITION_NAME_PATTERN}%`,
  ]);
  const editionId = editionRes.rows[0]?.id;
  if (!editionId) throw new Error(`Could not find an edition matching "${EDITION_NAME_PATTERN}"`);

  let grandTotal = 0;

  for (const [folderName, dbSportName] of Object.entries(SPORT_FOLDER_TO_DB_NAME)) {
    const athletesDir = join(ROOT_DIR, folderName, "Athletes");
    let entries: AthleteEntry[];
    try {
      entries = findAthleteFolders(athletesDir);
    } catch {
      console.warn(`Skipping "${folderName}" — no Athletes folder found at ${athletesDir}`);
      continue;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`\n=== ${folderName} -> "${dbSportName}" (${entries.length} athletes) ===`);

    let sortOrder = 1;
    for (const { name, imagePath } of entries) {
      const ext = extname(imagePath).toLowerCase();
      const contentType = CONTENT_TYPES[ext];
      if (!contentType) {
        console.warn(`Unrecognized extension for "${name}" (${imagePath}), skipping`);
        continue;
      }

      // Rename the original file in place to match the athlete's name, as
      // requested — keeps the source folder self-describing going forward.
      const renamedPath = join(dirname(imagePath), `${name}${ext}`);
      let finalPath = imagePath;
      if (renamedPath !== imagePath) {
        if (!existsSync(renamedPath)) renameSync(imagePath, renamedPath);
        finalPath = renamedPath;
      }

      const buffer = readFileSync(finalPath);
      const key = `uploads/${randomUUID()}${ext}`;
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }));
      const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

      await pool.query(
        `INSERT INTO media (url, content_type, filename) VALUES ($1, $2, $3) ON CONFLICT (url) DO NOTHING`,
        [publicUrl, contentType, `${name}${ext}`]
      );
      await pool.query(
        `INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [editionId, name, dbSportName, publicUrl, sortOrder]
      );

      console.log(`  [${sortOrder}/${entries.length}] ${name}`);
      sortOrder++;
      grandTotal++;
    }
  }

  await pool.end();
  console.log(`\nDone. Added ${grandTotal} players across ${Object.keys(SPORT_FOLDER_TO_DB_NAME).length} sports to edition ${editionId}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
