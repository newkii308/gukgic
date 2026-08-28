import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const user = db.getUserByUsername(params.username);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const currentUser = getCurrentUserFromRequest(req);
  const friendshipStatus = currentUser
    ? db.getFriendshipStatus(currentUser.id, user.id)
    : 'none';

  return NextResponse.json({ user, friendshipStatus });
}
