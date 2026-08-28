import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const currentUser = getCurrentUserFromRequest(req);

  const users = db.searchUsers(q, currentUser?.id);
  return NextResponse.json({ users });
}
