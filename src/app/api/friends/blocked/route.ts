import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const blocked = await db.getBlockedUsers(user.id);
    return NextResponse.json({ blocked });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch blocked users' }, { status: 500 });
  }
}
