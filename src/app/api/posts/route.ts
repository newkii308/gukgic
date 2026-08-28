import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { postCreateSchema } from '@/lib/schemas';
import { apiLimiter } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const cursor = searchParams.get('cursor') || undefined;
    const targetUserId = searchParams.get('userId') || undefined;

    const posts = await db.getPosts(user?.id, { limit, cursor, userId: targetUserId });
    return NextResponse.json({ posts });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized. Please sign in to post.');
    }

    const rateCheck = apiLimiter.check(30, `post_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'ທ່ານໂພສໄວເກີນໄປ ກະລຸນາລໍຖ້າຈັກໜ່ອຍ (Rate limit exceeded)' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = postCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { content, mediaUrl, mediaType } = parsed.data;

    const post = await db.createPost(user.id, content, mediaUrl, mediaType);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
