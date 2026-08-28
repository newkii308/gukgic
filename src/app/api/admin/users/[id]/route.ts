import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireAdminOnly(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { role, isBanned, isSuspended } = body;

    const user = db.getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = db.updateUser(params.id, {
      role: role || user.role,
      isBanned: isBanned !== undefined ? isBanned : user.isBanned,
      isSuspended: isSuspended !== undefined ? isSuspended : user.isSuspended,
    });

    db.addAuditLog({
      adminId: auth.user.id,
      adminName: auth.user.name,
      action: 'UPDATE_USER_ROLE_STATUS',
      targetType: 'USER',
      targetId: params.id,
      details: `Updated user @${user.username} role to ${role || user.role}, banned: ${isBanned}`,
    });

    return NextResponse.json({ user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
