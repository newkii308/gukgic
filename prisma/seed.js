const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.postComment.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany();
  await prisma.block.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const userKhampheng = await prisma.user.create({
    data: {
      id: 'user_khampheng',
      username: 'khampheng',
      name: 'Khampheng Dev',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      bio: 'ສະບາຍດີ! ມັກຊອກຫາເພື່ອນໃໝ່ ຖ່າຍຮູບ ແລະ ຮ້ານກາເຟງາມໆໃນວຽງຈັນ ☕🇱🇦',
      location: 'Vientiane Capital',
      city: 'Vientiane',
      languages: JSON.stringify(['ລາວ', 'English', 'ไทย']),
      interests: JSON.stringify(['Photography', 'Coffee', 'Music', 'Tech', 'Travel']),
      role: 'admin',
      settings: JSON.stringify({
        profileVisibility: 'public',
        postVisibility: 'public',
        whoCanSendRequests: 'everyone',
        pushNotifications: true,
        messageNotifications: true,
        socialNotifications: true,
      }),
    },
  });

  const userAlouny = await prisma.user.create({
    data: {
      id: 'user_alouny',
      username: 'alouny_s',
      name: 'Alouny Souvannavong',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
      bio: 'ສະບາຍດີທຸກຄົນ! ມັກຖ່າຍຮູບຟິມ & ຊອກຫາຮ້ານກາເຟໃໝ່ໆ 📸✨',
      location: 'Vientiane, Laos',
      city: 'Vientiane',
      languages: JSON.stringify(['ລາວ', 'English', 'ไทย']),
      interests: JSON.stringify(['Photography', 'Cafe hopping', 'Indie Music', 'Art']),
      role: 'user',
      settings: JSON.stringify({
        profileVisibility: 'public',
        postVisibility: 'public',
        whoCanSendRequests: 'everyone',
        pushNotifications: true,
        messageNotifications: true,
        socialNotifications: true,
      }),
    },
  });

  const userKhamla = await prisma.user.create({
    data: {
      id: 'user_khamla',
      username: 'khamla_dev',
      name: 'Khamla Phommachan',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      bio: 'Junior Frontend Dev ຢູ່ຫຼວງພະບາງ ມັກປັ່ນລົດຖີບຍາມແລງ 🚴‍♂️💻☕',
      location: 'Luang Prabang',
      city: 'Luang Prabang',
      languages: JSON.stringify(['ລາວ', 'English', '中文']),
      interests: JSON.stringify(['Coding', 'Cycling', 'Nature', 'Coffee']),
      role: 'user',
      settings: JSON.stringify({
        profileVisibility: 'public',
        postVisibility: 'public',
        whoCanSendRequests: 'everyone',
        pushNotifications: true,
        messageNotifications: true,
        socialNotifications: true,
      }),
    },
  });

  // 2. Create Friendships
  await prisma.friendship.create({
    data: {
      user1Id: userKhampheng.id,
      user2Id: userAlouny.id,
    },
  });

  // 3. Create Posts
  const post1 = await prisma.post.create({
    data: {
      id: 'post_seed_1',
      userId: userKhampheng.id,
      content: 'ມື້ນີ້ມານັ່ງຮ້ານກາເຟແຖວແຄມຂອງ ວຽງຈັນ ອາກາດດີຫຼາຍ! ມີໃຜຢູ່ວຽງຈັນຢາກມານັ່ງລົມກັນບໍ່? ☕🍃 #Vientiane #CafeVibes',
      mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
    },
  });

  const post2 = await prisma.post.create({
    data: {
      id: 'post_seed_2',
      userId: userAlouny.id,
      content: 'ພາບຖ່າຍຟິມຈາກທາດຫຼວງມື້ວານນີ້ ມັກແສງຍາມແລງຫຼາຍ 📸✨ #LaoFilm #ThatLuang',
      mediaUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
    },
  });

  // 4. Create Likes and Comments
  await prisma.postLike.create({
    data: {
      postId: post1.id,
      userId: userAlouny.id,
    },
  });

  await prisma.postComment.create({
    data: {
      postId: post1.id,
      userId: userAlouny.id,
      content: 'ຮ້ານໃດນິອ້າຍ? ງາມຫຼາຍ!',
    },
  });

  // 5. Create Conversation & Messages
  const conversation = await prisma.conversation.create({
    data: {
      members: {
        create: [
          { userId: userKhampheng.id },
          { userId: userAlouny.id },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: userAlouny.id,
      content: 'ສະບາຍດີອ້າຍຄຳແພງ! ສະບາຍດີບໍ່?',
      type: 'text',
      isRead: true,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: userKhampheng.id,
      content: 'ສະບາຍດີອາລຸນີ! ສະບາຍດີ, ວຽກຊ່ວງນີ້เป็นจั่งใดแด่?',
      type: 'text',
      isRead: true,
    },
  });

  // 6. Create Notifications
  await prisma.notification.create({
    data: {
      userId: userKhampheng.id,
      senderId: userAlouny.id,
      type: 'post_like',
      title: 'ຖືກໃຈໂພສຂອງທ່ານ',
      body: 'Alouny Souvannavong ໄດ້ຖືກໃຈໂພສຂອງທ່ານ',
      targetId: post1.id,
      isRead: false,
    },
  });

  // 7. Create Advertisement
  await prisma.advertisement.create({
    data: {
      title: 'กาแฟดาว (Dao Coffee) — หอม เข้ม จากที่ราบสูงโบลาเวน',
      sponsor: 'Dao Heuang Group',
      description: 'สัมผัสรสชาติกาแฟอาราบิก้าแท้ 100% จากแหล่งปลูกธรรมชาติที่ดีที่สุดในลาว สั่งซื้อออนไลน์วันนี้รับส่วนลดพิเศษ!',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      ctaText: 'ສັ່ງຊື້ເລີຍ',
      targetUrl: 'https://daocoffee.com',
      badge: 'Sponsored',
      isActive: true,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
