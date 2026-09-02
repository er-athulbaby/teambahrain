const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

/** Presigns an S3 upload, then PUTs the file directly to S3 from the browser
 * (the file's bytes never pass through our server). Returns the public URL. */
export async function uploadFile(file: File): Promise<string> {
  const isVideo = file.type.startsWith("video/");
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(`File must be under ${Math.round(maxBytes / (1024 * 1024))}MB`);
  }

  const presignRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  if (!presignRes.ok) {
    const data = await presignRes.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not start upload");
  }
  const { uploadUrl, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!putRes.ok) throw new Error("Upload to storage failed");

  return publicUrl;
}
