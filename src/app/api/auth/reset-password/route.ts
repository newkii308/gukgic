import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { authLimiter } from '@/lib/rate-limit';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = authLimiter.check(5, `reset_pwd_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many attempts. Please wait 1 minute.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;
    const jwtSecret = process.env.JWT_SECRET || 'gukgic-dev-jwt-secret-key-change-in-prod-2026';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (decoded.type !== 'pwd_reset' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
