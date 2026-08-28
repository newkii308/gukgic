import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, hashPassword, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, name, password, city, interests } = body;

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ (Missing required fields)' },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();
    if (cleanUsername.length < 3 || !/^[a-z0-9_]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username ຕ້ອງມີຢ່າງໜ້ອຍ 3 ຕົວອັກສອນ (ຕົວອັກສອນພາສາອັງກິດ, ຕົວເລກ, _) (Invalid username format)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ (Password must be at least 6 characters)' },
        { status: 400 }
      );
    }

    const existing = db.getUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { error: 'Username ນີ້ມີຄົນໃຊ້ແລ້ວ (Username is already taken)' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      name: name.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=200`,
      location: city ? `${city}, Laos` : 'Vientiane, Laos',
      city: city || 'Vientiane',
      languages: ['ລາວ', 'English'],
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Coffee', 'Music'],
      friendsCount: 0,
      postsCount: 0,
      isOnline: true,
      role: 'user',
      settings: {
        profileVisibility: 'public',
        postVisibility: 'public',
        whoCanSendRequests: 'everyone',
        pushNotifications: true,
        messageNotifications: true,
        socialNotifications: true,
      },
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser, hashedPassword);
    const token = signToken(newUser);

    const res = NextResponse.json({ user: newUser, token }, { status: 201 });
    res.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
