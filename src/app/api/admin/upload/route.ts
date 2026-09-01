import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin, errorResponse } from "@/lib/admin/api";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return errorResponse("No file provided");

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return errorResponse("Only PNG, JPEG or WebP images are allowed");
  if (file.size > MAX_BYTES) return errorResponse("File must be under 8MB");

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
