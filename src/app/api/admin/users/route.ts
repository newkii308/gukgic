import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminOrModerator(req);
    if (auth instanceof NextResponse) return auth;

    const users = await db.getUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
