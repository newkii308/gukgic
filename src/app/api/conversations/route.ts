import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const conversations = await db.getConversations(user.id);
    return NextResponse.json({ conversations });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    const status = await db.getFriendshipStatus(user.id, targetUserId);
    if (status === 'blocked') {
      return forbiddenResponse('Cannot start conversation with blocked user');
    }

    const conversation = await db.getOrCreateConversation(user.id, targetUserId);
    return NextResponse.json({ conversation });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
