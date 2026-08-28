import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminOrModerator(req);
    if (auth instanceof NextResponse) return auth;

    const [stats, users, reports] = await Promise.all([
      db.getAdminStats(),
      db.getUsers(),
      db.getReports(),
    ]);

    const recentUsers = users.slice(0, 5);
    const pendingReports = reports.filter((r) => r.status === 'pending').slice(0, 5);

    return NextResponse.json({
      stats,
      recentUsers,
      pendingReports,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch admin overview' }, { status: 500 });
  }
}
