import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, userId } = body;

    // Fast switch demo user
    if (userId) {
      const user = db.getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const token = signToken(user);
      const res = NextResponse.json({ user, token });
      res.cookies.set('friend_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });
      return res;
    }

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = db.getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password || 'password123', 'password123');
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken(user);
    const res = NextResponse.json({ user, token });
    res.cookies.set('friend_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
