import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, comparePassword, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ກະລຸນາປ້ອນ Username ແລະ ລະຫັດຜ່ານ (Username and password are required)' },
        { status: 400 }
      );
    }

    const userWithHash = db.getUserWithPassword(username.trim());
    if (!userWithHash) {
      return NextResponse.json(
        { error: 'Username ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ (Invalid username or password)' },
        { status: 401 }
      );
    }

    if (userWithHash.isBanned) {
      return NextResponse.json(
        { error: 'ບັນຊີຂອງທ່ານຖືກລະງັບການໃຊ້ງານ (Your account has been suspended)' },
        { status: 403 }
      );
    }

    // Verify password with bcrypt
    const isValid = await comparePassword(password, userWithHash.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Username ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ (Invalid username or password)' },
        { status: 401 }
      );
    }

    const { passwordHash, ...user } = userWithHash;
    const token = signToken(user);

    const res = NextResponse.json({ user, token });
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
