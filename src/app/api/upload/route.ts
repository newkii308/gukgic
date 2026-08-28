import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getCurrentUserFromRequest } from '@/lib/auth';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  // Images
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  // Audio
  'audio/webm': '.webm',
  'audio/wav': '.wav',
  'audio/mp3': '.mp3',
  'audio/mpeg': '.mp3',
  'audio/ogg': '.ogg',
  'audio/m4a': '.m4a',
  'audio/mp4': '.m4a',
  'audio/x-m4a': '.m4a',
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 15MB size limit' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    const ext = ALLOWED_MIME_TYPES[mimeType.toLowerCase()] || path.extname(file.name) || '.bin';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, safeFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      url: publicUrl,
      filename: safeFileName,
      size: file.size,
      mimeType,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
