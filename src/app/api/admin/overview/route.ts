import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  const stats = db.getAdminStats();
  const recentUsers = db.getUsers().slice(0, 5);
  const pendingReports = db.getReports().filter((r) => r.status === 'pending').slice(0, 5);

  return NextResponse.json({
    stats,
    recentUsers,
    pendingReports,
  });
}
