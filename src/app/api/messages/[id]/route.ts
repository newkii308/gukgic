import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const success = await db.deleteMessage(params.id, user.id);
    if (!success) {
      return NextResponse.json({ error: 'Message not found or unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
