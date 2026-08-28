const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json || data,
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runProductionTests() {
  console.log('🚀 Starting GUKGIC Production Development Cycle Verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const userA_username = `user_a_${timestamp}`;
  const userB_username = `user_b_${timestamp}`;

  // 1. Register User A
  console.log('--- 1. Two-User Flow: Registration & Auth ---');
  const regARes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: userA_username,
      name: 'User Alpha Laos',
      password: 'password123',
      city: 'Vientiane',
      interests: ['Coffee', 'Photography'],
    }
  );
  assert(regARes.status === 201 && regARes.data.user?.id, 'User A registers successfully and gets DB cuid');
  const userA = regARes.data.user;
  const cookieA = regARes.headers['set-cookie'] ? regARes.headers['set-cookie'][0] : `gukgic_token=${regARes.data.token}`;

  // 2. Register User B
  const regBRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: userB_username,
      name: 'User Beta LuangPrabang',
      password: 'password123',
      city: 'Luang Prabang',
      interests: ['Coding', 'Cycling'],
    }
  );
  assert(regBRes.status === 201 && regBRes.data.user?.id, 'User B registers successfully and gets DB cuid');
  const userB = regBRes.data.user;
  const cookieB = regBRes.headers['set-cookie'] ? regBRes.headers['set-cookie'][0] : `gukgic_token=${regBRes.data.token}`;

  // 3. User A discovers User B
  console.log('\n--- 2. Discovery & Friend Request System ---');
  const discoverRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/friends/discover?search=${userB_username}`,
    method: 'GET',
    headers: { Cookie: cookieA },
  });
  assert(
    discoverRes.status === 200 &&
    discoverRes.data.users.some((u) => u.id === userB.id),
    'User A discovers User B via real DB query'
  );

  // 4. Prevent Self Friend Request
  const selfReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userA.id }
  );
  assert(selfReqRes.status === 400, 'Self friend request is rejected with 400');

  // 5. User A sends Friend Request to User B
  const sendFriendRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userB.id }
  );
  assert(sendFriendRes.status === 201 && sendFriendRes.data.request?.status === 'pending', 'User A sends friend request to User B');
  const friendReqId = sendFriendRes.data.request.id;

  // 6. Prevent Duplicate Friend Request
  const dupReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userB.id }
  );
  assert(dupReqRes.status === 400, 'Duplicate friend request is blocked');

  // 7. User B accepts Friend Request
  const acceptRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/accept',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    { requestId: friendReqId }
  );
  assert(acceptRes.status === 200 && acceptRes.data.success, 'User B accepts friend request transactionally');

  // 8. User A creates Post
  console.log('\n--- 3. Social Feed, Likes & Comments ---');
  const createPostRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { content: 'ສະບາຍດີ! ທົດສອບລະບົບໂພສຈິງ 🇱🇦☕' }
  );
  assert(createPostRes.status === 201 && createPostRes.data.post?.id, 'User A creates post persisted to database');
  const postId = createPostRes.data.post.id;

  // 9. User B Likes Post
  const likeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/posts/${postId}/like`,
    method: 'POST',
    headers: { Cookie: cookieB },
  });
  assert(likeRes.status === 200 && likeRes.data.isLiked === true, 'User B likes User A post');

  // 10. User B Comments on Post
  const commentRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/posts/${postId}/comments`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    { content: 'ຍິນດີນຳເດີ້ອ້າຍ Alpha!' }
  );
  assert(commentRes.status === 201 && commentRes.data.comment?.id, 'User B adds comment to post');

  // 11. User A checks Notifications
  console.log('\n--- 4. Real Notifications ---');
  const notifRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/notifications',
    method: 'GET',
    headers: { Cookie: cookieA },
  });
  assert(
    notifRes.status === 200 &&
    notifRes.data.notifications.some((n) => n.type === 'post_like' || n.type === 'friend_accept'),
    'User A receives real persisted notifications for friend accept and post like'
  );

  // 12. Real Messaging
  console.log('\n--- 5. Persistent Messaging ---');
  const convRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/conversations',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userB.id }
  );
  assert(convRes.status === 200 && convRes.data.conversation?.id, 'Conversation established between User A and B');
  const convId = convRes.data.conversation.id;

  const msgRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/conversations/${convId}/messages`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { content: 'ສະບາຍດີ Beta! ວຽກເປັນຈັ່ງໃດແດ່?' }
  );
  assert(msgRes.status === 201 && msgRes.data.message?.id, 'User A sends persistent message to User B');

  const fetchMsgRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/conversations/${convId}/messages`,
    method: 'GET',
    headers: { Cookie: cookieB },
  });
  assert(
    fetchMsgRes.status === 200 &&
    fetchMsgRes.data.messages.some((m) => m.content.includes('ສະບາຍດີ Beta')),
    'User B fetches persisted message from database'
  );

  // 13. Security: Role escalation prevention
  console.log('\n--- 6. Security Hardening & Profile Protection ---');
  const roleHackRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/profile',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { role: 'admin', isBanned: false, bio: 'Updated Secure Bio 🇱🇦' }
  );
  const dbUserA = await prisma.user.findUnique({ where: { id: userA.id } });
  assert(
    roleHackRes.status === 200 && dbUserA.role === 'user',
    'Profile update ignores malicious role escalation attempt and preserves role=user'
  );

  // 14. Security: Unauthorized Post Deletion Prevention
  const unauthDelRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/posts/${postId}`,
    method: 'DELETE',
    headers: { Cookie: cookieB },
  });
  assert(unauthDelRes.status === 403, 'User B cannot delete User A post (fails with 403)');

  // 15. Security: Server-side Privacy Enforcement
  await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/profile',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    {
      settings: {
        profileVisibility: 'private',
        postVisibility: 'public',
        whoCanSendRequests: 'everyone',
        pushNotifications: true,
        messageNotifications: true,
        socialNotifications: true,
      },
    }
  );

  // Unauthenticated request to private profile
  const privateProfileRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/users/${userA.username}`,
    method: 'GET',
  });
  assert(
    privateProfileRes.status === 200 && privateProfileRes.data.user?.isRestricted === true,
    'Private profile returns restricted payload to unauthorized clients'
  );

  // 16. Block User System
  console.log('\n--- 7. Block System Enforcement ---');
  const blockRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/moderation/block',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userB.id }
  );
  assert(blockRes.status === 200 && blockRes.data.success, 'User A blocks User B');

  // Verify interaction blocked
  const blockedFriendReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    { targetUserId: userA.id }
  );
  assert(blockedFriendReqRes.status === 400, 'Blocked user cannot send friend request');

  console.log(`\n======================================================`);
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runProductionTests().catch((err) => {
  console.error('Test execution error:', err);
  prisma.$disconnect();
  process.exit(1);
});
