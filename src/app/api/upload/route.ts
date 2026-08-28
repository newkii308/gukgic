import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { uploadLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const rateCheck = uploadLimiter.check(15, `upload_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many uploads. Please wait a moment.' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await storage.upload(buffer, file.name || 'upload.bin', mimeType);

    return NextResponse.json({
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 400 });
  }
}
