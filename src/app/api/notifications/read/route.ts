import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  db.markAllNotificationsRead(user.id);
  return NextResponse.json({ success: true });
}
