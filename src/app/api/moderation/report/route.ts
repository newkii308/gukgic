import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(req);
    const body = await req.json();
    const { targetType, targetId, reason, details } = body;

    const report = db.report({
      targetType,
      targetId,
      reporterId: user?.id || 'anonymous',
      reason,
      details,
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
