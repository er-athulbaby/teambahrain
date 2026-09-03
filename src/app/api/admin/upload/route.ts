import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin, errorResponse } from "@/lib/admin/api";
import { createPresignedUpload, isS3Configured } from "@/lib/s3";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isS3Configured()) {
    return errorResponse(
      "S3 is not configured yet — set AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.",
      503
    );
  }

  const { filename, contentType } = await request.json();
  if (typeof filename !== "string" || typeof contentType !== "string") {
    return errorResponse("filename and contentType are required");
  }

  const ext = ALLOWED_TYPES[contentType];
  if (!ext) return errorResponse("Only PNG, JPEG, WebP, ICO images or MP4/WebM/MOV videos are allowed");

  const key = `uploads/${randomUUID()}.${ext}`;
  const { uploadUrl, publicUrl } = await createPresignedUpload(key, contentType);

  return NextResponse.json({ uploadUrl, publicUrl });
}
