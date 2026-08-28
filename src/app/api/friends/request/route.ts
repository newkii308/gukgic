import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { friendRequestSchema } from '@/lib/schemas';
import { apiLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const rateCheck = apiLimiter.check(20, `freq_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = friendRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { targetUserId } = parsed.data;

    const request = await db.sendFriendRequest(user.id, targetUserId);
    return NextResponse.json({ request }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send request' }, { status: 400 });
  }
}
