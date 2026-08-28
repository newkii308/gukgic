import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOrModerator } from '@/lib/admin-auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const updated = await db.updateAd(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    await db.addAuditLog({
      adminId: auth.user.id,
      adminName: auth.user.name,
      action: 'UPDATE_ADVERTISEMENT',
      targetType: 'AD',
      targetId: params.id,
      details: `Updated ad ${params.id}: ${JSON.stringify(body)}`,
    });

    return NextResponse.json({ ad: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdminOrModerator(req);
  if (auth instanceof NextResponse) return auth;

  const success = await db.deleteAd(params.id);
  if (success) {
    await db.addAuditLog({
      adminId: auth.user.id,
      adminName: auth.user.name,
      action: 'DELETE_ADVERTISEMENT',
      targetType: 'AD',
      targetId: params.id,
      details: `Deleted ad campaign ${params.id}`,
    });
  }

  return NextResponse.json({ success });
}
