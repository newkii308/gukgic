import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    const post = await db.getPostById(params.id, user?.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const success = await db.deletePost(params.id, user.id);
    if (!success) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
