import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  const logs = db.getAuditLogs();
  return NextResponse.json({ logs });
}
