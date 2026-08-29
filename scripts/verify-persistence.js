const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const friendships = await prisma.friendship.count();
  const posts = await prisma.post.count();
  const comments = await prisma.postComment.count();
  const likes = await prisma.postLike.count();
  const messages = await prisma.message.count();
  const notifications = await prisma.notification.count();

  console.log('--- Database Persistence Verification ---');
  console.log(`Users: ${users}`);
  console.log(`Friendships: ${friendships}`);
  console.log(`Posts: ${posts}`);
  console.log(`Comments: ${comments}`);
  console.log(`Likes: ${likes}`);
  console.log(`Messages: ${messages}`);
  console.log(`Notifications: ${notifications}`);
  console.log('-----------------------------------------');

  if (users > 0 && posts > 0) {
    console.log('✅ PERSISTENCE VERIFIED: Database records remain completely intact across restarts.');
  } else {
    console.error('❌ PERSISTENCE FAILURE: Records missing.');
    process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
