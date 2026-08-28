import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, comparePassword, hashPassword, unauthorizedResponse } from '@/lib/auth';
import { apiLimiter } from '@/lib/rate-limit';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const rateCheck = apiLimiter.check(10, `pwd_${user.id}`);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ ແລະ ລະຫັດຜ່ານໃໝ່' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ' }, { status: 400 });
    }

    const userWithHash = await db.getUserWithPassword(user.username);
    if (!userWithHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, userWithHash.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'ລະຫັດຜ່ານປັດຈຸບັນບໍ່ຖືກຕ້ອງ (Current password incorrect)' }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true, message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ (Password updated successfully)' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
