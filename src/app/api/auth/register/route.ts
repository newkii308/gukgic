import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, hashPassword, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { registerSchema } from '@/lib/schemas';
import { authLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = authLimiter.check(30, `register_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'ສະໝັກສະມາຊິກຫຼາຍເກີນໄປ ກະລຸນາລໍຖ້າ 1 ນາທີ (Too many register attempts)' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, name, password, city, location, bio, interests, languages } = parsed.data;

    const existing = await db.getUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: 'Username ນີ້ມີຄົນໃຊ້ແລ້ວ (Username is already taken)' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await db.createUser({
      username,
      name,
      passwordHash: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=200`,
      city: city || 'Vientiane',
      location: location || (city ? `${city}, Laos` : 'Vientiane, Laos'),
      bio: bio || undefined,
      interests: interests && interests.length > 0 ? interests : ['Coffee', 'Music'],
      languages: languages && languages.length > 0 ? languages : ['ລາວ', 'English'],
      role: 'user',
    });

    const token = signToken(createdUser);

    const res = NextResponse.json({ user: createdUser, token }, { status: 201 });
    res.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການລົງທະບຽນ' }, { status: 500 });
  }
}
