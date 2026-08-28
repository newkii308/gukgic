import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { User } from '@/types';

export function requireAdminOrModerator(req: NextRequest): { user: User } | NextResponse {
  const user = getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  if (user.role !== 'admin' && user.role !== 'moderator') {
    return NextResponse.json({ error: 'Forbidden. Admin or Moderator privileges required.' }, { status: 403 });
  }

  return { user };
}

export function requireAdminOnly(req: NextRequest): { user: User } | NextResponse {
  const user = getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden. Administrator privileges required.' }, { status: 403 });
  }

  return { user };
}
