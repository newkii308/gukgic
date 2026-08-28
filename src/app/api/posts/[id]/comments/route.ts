import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';
import { commentCreateSchema } from '@/lib/schemas';
import { apiLimiter } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await db.getComments(params.id);
    return NextResponse.json({ comments });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized. Please sign in to comment.');
    }

    const rateCheck = apiLimiter.check(30, `comment_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = commentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const comment = await db.addComment(params.id, user.id, parsed.data.content);
    return NextResponse.json({ comment }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'Post not found') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
