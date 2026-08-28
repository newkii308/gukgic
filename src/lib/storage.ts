import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

    const ext = path.extname(originalName).toLowerCase() || this.getExtensionFromMime(mimeType);
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

  private getExtensionFromMime(mime: string): string {
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
      default:
        return '';
    }
  }
}

// Export default singleton storage provider (can easily swap with S3StorageProvider when configured)
export const storage: StorageProvider = new LocalStorageProvider();
