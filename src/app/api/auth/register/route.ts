import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, hashPassword } from '@/lib/auth';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, password, city, interests } = body;

    if (!username || !name || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = db.getUserByUsername(username);
    if (existing) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username.toLowerCase().trim(),
      name: name.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      location: city ? `${city}, Laos` : 'Vientiane, Laos',
      city: city || 'Vientiane',
      languages: ['ລາວ', 'English'],
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Coffee', 'Music'],
      friendsCount: 0,
      postsCount: 0,
      isOnline: true,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser, hashedPassword);
    const token = signToken(newUser);

    const res = NextResponse.json({ user: newUser, token });
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
