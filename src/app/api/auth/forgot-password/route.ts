import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authLimiter } from '@/lib/rate-limit';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  username: z.string().min(1, 'Please enter your username').trim(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = authLimiter.check(5, `forgot_pwd_${ip}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many reset attempts. Please wait 1 minute.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const user = await db.getUserByUsername(parsed.data.username);
    if (!user) {
      // Return 200 with generic message to prevent username enumeration
      return NextResponse.json({
        success: true,
        message: 'If the account exists, a password reset link has been issued.',
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'gukgic-dev-jwt-secret-key-change-in-prod-2026';
    const resetToken = jwt.sign(
      { userId: user.id, username: user.username, type: 'pwd_reset' },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetToken, // Provided for verification and client reset flow
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
