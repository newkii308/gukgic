import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export interface StorageProvider {
  upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ url: string; path: string; size: number; mimeType: string }>;
  delete(fileUrl: string): Promise<boolean>;
  getUrl(filePath: string): string;
}

export const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  // Audio
  'audio/webm',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/aac',
]);

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

function getExtensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'audio/webm':
      return '.webm';
    case 'audio/wav':
      return '.wav';
    case 'audio/ogg':
      return '.ogg';
    case 'audio/mp4':
      return '.mp4';
    case 'audio/mpeg':
      return '.mp3';
    case 'audio/aac':
      return '.aac';
    default:
      return '';
  }
}

/**
 * Cloudflare R2 Production Object Storage Provider (S3-Compatible)
 */
export class CloudflareR2StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    publicUrl: string;
  }) {
    this.bucket = config.bucket;
    this.publicUrl = config.publicUrl.replace(/\/+$/, '');
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ url: string; path: string; size: number; mimeType: string }> {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds limit (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }

    const ext = path.extname(originalName).toLowerCase() || getExtensionFromMime(mimeType);
    const uniqueKey = `uploads/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: uniqueKey,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    const publicFileUrl = `${this.publicUrl}/${uniqueKey}`;
    return {
      url: publicFileUrl,
      path: uniqueKey,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      let key = fileUrl;
      if (fileUrl.startsWith(this.publicUrl)) {
        key = fileUrl.replace(`${this.publicUrl}/`, '');
      } else if (fileUrl.startsWith('http')) {
        const parsed = new URL(fileUrl);
        key = parsed.pathname.replace(/^\/+/, '');
      }

      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  getUrl(filePath: string): string {
    if (filePath.startsWith('http')) return filePath;
    return `${this.publicUrl}/${filePath.replace(/^\/+/, '')}`;
  }
}

/**
 * Local Filesystem Storage Provider (for development / offline environments)
 */
export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ url: string; path: string; size: number; mimeType: string }> {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}`);
    }

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed limit (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }

    const ext = path.extname(originalName).toLowerCase() || getExtensionFromMime(mimeType);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;
    return {
      url: publicUrl,
      path: filePath,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith('/uploads/')) return false;
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getUrl(filePath: string): string {
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }
}

// Instantiate storage provider based on environment configuration
function createStorageProvider(): StorageProvider {
  const r2AccountId = process.env.R2_ACCOUNT_ID;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2Bucket = process.env.R2_BUCKET_NAME;
  const r2PublicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_URL;

  if (r2AccountId && r2AccessKeyId && r2SecretAccessKey && r2Bucket && r2PublicUrl) {
    return new CloudflareR2StorageProvider({
      accountId: r2AccountId,
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
      bucket: r2Bucket,
      publicUrl: r2PublicUrl,
    });
  }

  return new LocalStorageProvider();
}

export const storage: StorageProvider = createStorageProvider();
