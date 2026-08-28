import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { apiLimiter } from '@/lib/rate-limit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized. Please sign in to like.');
    }

    const rateCheck = apiLimiter.check(60, `like_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const res = await db.toggleLikePost(params.id, user.id);
    return NextResponse.json({
      isLiked: res.isLiked,
      liked: res.isLiked,
      likesCount: res.likesCount,
    });
  } catch (err: any) {
    if (err.message === 'Post not found') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update like status' }, { status: 500 });
  }
}
