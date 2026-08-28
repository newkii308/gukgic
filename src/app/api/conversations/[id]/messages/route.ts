import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = db.getMessages(params.id, user.id);
    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Forbidden' }, { status: 403 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, type, mediaUrl, duration, replyTo } = body;

    const message = db.createMessage({
      conversationId: params.id,
      senderId: user.id,
      content: content || (type === 'voice' ? 'Voice Message' : type === 'image' ? 'Image Attachment' : ''),
      type,
      mediaUrl,
      duration,
      replyTo,
    });

    if (!message) {
      return NextResponse.json({ error: 'Failed to create message' }, { status: 400 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
