import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const [friends, requests, sentRequests] = await Promise.all([
      db.getFriends(user.id),
      db.getPendingRequests(user.id),
      db.getSentRequests(user.id),
    ]);

    return NextResponse.json({ friends, requests, sentRequests });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch friends data' }, { status: 500 });
  }
}
