import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getCurrentUserFromRequest(req);
  const posts = db.getPosts(user?.id);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, mediaUrl } = body;

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: 'Content or media is required' }, { status: 400 });
    }

    const post = db.createPost(user.id, content || '', mediaUrl);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
