import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminOrModerator(req);
    if (auth instanceof NextResponse) return auth;

    const reports = await db.getReports();
    return NextResponse.json({ reports });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
