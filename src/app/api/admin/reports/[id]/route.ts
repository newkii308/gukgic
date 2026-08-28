import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { action } = body; // 'dismiss' | 'hidden' | 'removed' | 'warned' | 'suspended' | 'banned'

    if (action === 'dismiss') {
      const success = db.dismissReport(params.id, auth.user);
      return NextResponse.json({ success });
    } else {
      const success = db.resolveReport(params.id, action, auth.user);
      return NextResponse.json({ success });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
