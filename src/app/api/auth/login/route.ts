import { NextRequest, NextResponse } from 'next/server';
import { db, formatUser } from '@/lib/db';
import { signToken, comparePassword, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { loginSchema } from '@/lib/schemas';
import { authLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = authLimiter.check(30, `login_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'ພະຍາຍາມເຂົ້າສູ່ລະບົບຫຼາຍເກີນໄປ ກະລຸນາລໍຖ້າ 1 ນາທີ (Too many login attempts)' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const userWithHash = await db.getUserWithPassword(username);
    if (!userWithHash) {
      return NextResponse.json(
        { error: 'Username ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ (Invalid username or password)' },
        { status: 401 }
      );
    }

    if (userWithHash.isBanned || userWithHash.isSuspended) {
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

    const user = formatUser(userWithHash);
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
    return NextResponse.json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ' }, { status: 500 });
  }
}
