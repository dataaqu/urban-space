import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';
import sharp from 'sharp';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

async function compressImage(
  fileBuffer: Buffer,
  contentType: string
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();

  // Resize if wider than 2400px, keeping aspect ratio
  if (metadata.width && metadata.width > 2400) {
    image.resize(2400, undefined, { withoutEnlargement: true });
  }

  // Convert to WebP for best compression
  const compressed = await image.webp({ quality: 82 }).toBuffer();

  return {
    buffer: compressed,
    contentType: 'image/webp',
    ext: '.webp',
  };
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'urban-space'
): Promise<{ url: string; publicId: string }> {
  // Compress image before upload
  const isImage = contentType.startsWith('image/') && !contentType.includes('svg');
  let finalBuffer = fileBuffer;
  let finalContentType = contentType;
  let ext = path.extname(fileName) || '.jpg';

  if (isImage) {
    try {
      const compressed = await compressImage(fileBuffer, contentType);
      finalBuffer = compressed.buffer;
      finalContentType = compressed.contentType;
      ext = compressed.ext;
    } catch {
      // Fall back to original if compression fails
    }
  }

  const key = `${folder}/${randomUUID()}${ext}`;

  await S3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: finalBuffer,
      ContentType: finalContentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return {
    url: `${PUBLIC_URL}/${key}`,
    publicId: key,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await S3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: publicId,
    })
  );
}

export function getR2KeyFromUrl(url: string): string | null {
  if (!url || !PUBLIC_URL) return null;
  if (url.startsWith(PUBLIC_URL)) {
    return url.slice(PUBLIC_URL.length + 1);
  }
  return null;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  const key = getR2KeyFromUrl(url);
  if (key) {
    try {
      await deleteImage(key);
    } catch (e) {
      console.error('Failed to delete R2 image:', key, e);
    }
  }
}
