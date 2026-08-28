import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const interest = searchParams.get('interest') || undefined;
    const search = searchParams.get('search') || undefined;

    const users = await db.discoverFriends(user?.id, { city, interest, search });
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to discover friends' }, { status: 500 });
  }
}
