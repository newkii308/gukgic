import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const friends = db.getFriends(user.id);
  const requests = db.getPendingRequests(user.id);
  const sentRequests = db.getSentRequests(user.id);

  return NextResponse.json({ friends, requests, sentRequests });
}
