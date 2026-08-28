import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const user = await db.getUserByUsername(params.username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUser = await getCurrentUserFromRequest(req);
    const friendshipStatus = currentUser
      ? await db.getFriendshipStatus(currentUser.id, user.id)
      : 'none';

    if (friendshipStatus === 'blocked') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Enforce server-side profile privacy
    const isSelf = currentUser?.id === user.id;
    const visibility = user.settings?.profileVisibility || 'public';

    if (!isSelf) {
      if (visibility === 'private') {
        // Return restricted profile
        return NextResponse.json({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            isRestricted: true,
            settings: { profileVisibility: 'private' },
          },
          friendshipStatus,
        });
      }

      if (visibility === 'friends' && friendshipStatus !== 'friends') {
        return NextResponse.json({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            isRestricted: true,
            settings: { profileVisibility: 'friends' },
          },
          friendshipStatus,
        });
      }
    }

    return NextResponse.json({ user, friendshipStatus });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
