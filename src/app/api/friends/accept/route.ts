import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, targetUserId } = body;

    let success = false;
    if (requestId) {
      success = db.acceptFriendRequest(requestId, user.id);
    } else if (targetUserId) {
      const incoming = db.getPendingRequests(user.id).find((r) => r.senderId === targetUserId);
      if (incoming) {
        success = db.acceptFriendRequest(incoming.id, user.id);
      }
    }

    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
