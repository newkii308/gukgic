import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) {
    return unauthorizedResponse('Unauthorized. Please sign in.');
  }

  return NextResponse.json({ user });
}
