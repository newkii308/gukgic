import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUserFromRequest, comparePassword, unauthorizedResponse, TOKEN_COOKIE_NAME } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return unauthorizedResponse('Unauthorized');
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'ກະລຸນາປ້ອນລະຫັດຜ່ານເພື່ອຢືນຢັນການລຶບບັນຊີ' }, { status: 400 });
    }

    const userWithHash = await db.getUserWithPassword(user.username);
    if (!userWithHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await comparePassword(password, userWithHash.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ (Incorrect password)' }, { status: 401 });
    }

    // Transactionally delete all user-owned data
    await prisma.$transaction([
      prisma.friendship.deleteMany({
        where: { OR: [{ user1Id: user.id }, { user2Id: user.id }] },
      }),
      prisma.friendRequest.deleteMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      }),
      prisma.block.deleteMany({
        where: { OR: [{ blockerId: user.id }, { blockedId: user.id }] },
      }),
      prisma.postLike.deleteMany({ where: { userId: user.id } }),
      prisma.postComment.deleteMany({ where: { userId: user.id } }),
      prisma.post.deleteMany({ where: { userId: user.id } }),
      prisma.message.deleteMany({ where: { senderId: user.id } }),
      prisma.conversationMember.deleteMany({ where: { userId: user.id } }),
      prisma.notification.deleteMany({ where: { userId: user.id } }),
      prisma.user.delete({ where: { id: user.id } }),
    ]);

    const res = NextResponse.json({ success: true, message: 'ບັນຊີຖືກລຶບຮຽບຮ້ອຍແລ້ວ' });
    res.cookies.set(TOKEN_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
    res.cookies.set('friend_token', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
