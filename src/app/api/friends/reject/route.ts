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
    const { requestId } = body;
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const success = await db.rejectFriendRequest(requestId, user.id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to reject friend request' }, { status: 500 });
  }
}
