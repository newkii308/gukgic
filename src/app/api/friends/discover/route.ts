import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getCurrentUserFromRequest(req);
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || undefined;
  const interest = searchParams.get('interest') || undefined;
  const search = searchParams.get('search') || undefined;

  const users = db.discoverFriends(user?.id || 'user_me', { city, interest, search });
  return NextResponse.json({ users });
}
