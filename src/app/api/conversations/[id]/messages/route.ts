import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { messageSendSchema } from '@/lib/schemas';
import { apiLimiter } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const cursor = searchParams.get('cursor') || undefined;

    const messages = await db.getMessages(params.id, user.id, { limit, cursor });
    return NextResponse.json({ messages });
  } catch (err: any) {
    return forbiddenResponse(err.message || 'Forbidden');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const rateCheck = apiLimiter.check(60, `msg_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = messageSendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { content, type, mediaUrl, duration, replyToId } = parsed.data;

    const message = await db.createMessage(params.id, user.id, {
      content,
      type,
      mediaUrl,
      duration,
      replyToId,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      return forbiddenResponse('Not a member of this conversation');
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
