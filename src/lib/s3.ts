import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

let client: S3Client | null = null;

function getClient() {
  if (!client) client = new S3Client({ region: REGION });
  return client;
}

export function isS3Configured() {
  return Boolean(REGION && BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

export async function createPresignedUpload(key: string, contentType: string) {
  if (!BUCKET) throw new Error("AWS_S3_BUCKET is not configured");

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: 300 });
  const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}

/** Deletes the underlying S3 object for a URL previously returned by createPresignedUpload. */
export async function deleteUpload(publicUrl: string) {
  if (!BUCKET) throw new Error("AWS_S3_BUCKET is not configured");

  const key = publicUrl.split(`${BUCKET}.s3.${REGION}.amazonaws.com/`)[1];
  if (!key) return;

  await getClient().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
