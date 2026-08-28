import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const body = await req.json();
    const { requestId, targetUserId } = body;

    let targetReqId = requestId;
    if (!targetReqId && targetUserId) {
      const sent = await db.getSentRequests(user.id);
      const req = sent.find((r) => r.receiverId === targetUserId);
      if (req) targetReqId = req.id;
    }

    if (!targetReqId) {
      return NextResponse.json({ error: 'Request not found' }, { status: 400 });
    }

    const success = await db.cancelFriendRequest(targetReqId, user.id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to cancel friend request' }, { status: 500 });
  }
}
