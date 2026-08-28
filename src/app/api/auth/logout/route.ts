import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.set(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  res.cookies.set('friend_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return res;
}
