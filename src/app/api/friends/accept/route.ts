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

    let success = false;
    if (requestId) {
      success = await db.acceptFriendRequest(requestId, user.id);
    } else if (targetUserId) {
      const requests = await db.getPendingRequests(user.id);
      const incoming = requests.find((r) => r.senderId === targetUserId);
      if (incoming) {
        success = await db.acceptFriendRequest(incoming.id, user.id);
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Friend request not found or already processed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Friend request accepted' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 });
  }
}
