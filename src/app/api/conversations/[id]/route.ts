import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const conv = await db.getConversationById(params.id, user.id);
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ conversation: conv });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}
