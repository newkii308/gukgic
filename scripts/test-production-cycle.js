const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function extractCookies(headers) {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return '';
  if (Array.isArray(setCookie)) {
    return setCookie.map((c) => c.split(';')[0].trim()).join('; ');
  }
  return setCookie.split(';')[0].trim();
}

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
  const userC_username = `user_c_${timestamp}`;

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
  const cookieA = extractCookies(regARes.headers) || `gukgic_token=${regARes.data.token}`;

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
  const cookieB = extractCookies(regBRes.headers) || `gukgic_token=${regBRes.data.token}`;

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
      Array.isArray(discoverRes.data.users) &&
      discoverRes.data.users.some((u) => u.username === userB_username),
    'User A discovers User B via Prisma user query'
  );

  // 4. Friend Request Validation (Prevent Self Request)
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
  assert(selfReqRes.status === 400, 'Sending friend request to oneself fails (400)');

  // 5. Send Friend Request (User A -> User B)
  const sendReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { targetUserId: userB.id }
  );
  assert(sendReqRes.status === 201 && sendReqRes.data.request?.id, 'User A sends friend request to User B');

  // 6. Duplicate Friend Request Prevention
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
  assert(dupReqRes.status === 400, 'Duplicate friend request is rejected');

  // 7. Accept Friend Request (User B accepts User A)
  const acceptReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/accept',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    { requestId: sendReqRes.data.request.id }
  );
  assert(acceptReqRes.status === 200 && acceptReqRes.data.success, 'User B accepts friend request transactionally');

  // 8. Social Feed: Create Post (User A)
  console.log('\n--- 3. Social Feed: Posts, Likes & Comments ---');
  const createPostRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    {
      content: 'Hello Laos! Testing production persistence #gukgic',
    }
  );
  assert(createPostRes.status === 201 && createPostRes.data.post?.id, 'User A creates a post stored in Prisma');
  const post = createPostRes.data.post;

  // 9. Like Post (User B likes User A's post)
  const likeRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/posts/${post.id}/like`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    }
  );
  assert(
    likeRes.status === 200 &&
      (likeRes.data.liked === true || likeRes.data.isLiked === true) &&
      likeRes.data.likesCount === 1,
    'User B likes User A post (atomic count update)'
  );

  // 10. Comment on Post (User B comments on User A's post)
  const commentRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/posts/${post.id}/comments`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    { content: 'Welcome to GUKGIC! Sabaidee!' }
  );
  assert(commentRes.status === 201 && commentRes.data.comment?.id, 'User B comments on post');

  // 11. Notification Verification
  console.log('\n--- 4. Realtime Notification Persistence ---');
  const notifRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/notifications',
    method: 'GET',
    headers: { Cookie: cookieA },
  });
  assert(
    notifRes.status === 200 &&
      Array.isArray(notifRes.data.notifications) &&
      notifRes.data.notifications.length > 0,
    'User A receives persisted notifications for like/comment'
  );

  // 12. Persistent Messaging
  console.log('\n--- 5. Messaging & Conversation Room ---');
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
  assert(convRes.status === 200 && convRes.data.conversation?.id, 'User A creates/retrieves conversation with User B');
  const conversation = convRes.data.conversation;

  // Send Message A -> B
  const sendMsgRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/conversations/${conversation.id}/messages`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { content: 'Hey Beta, how is Luang Prabang?', type: 'text' }
  );
  assert(sendMsgRes.status === 201 && sendMsgRes.data.message?.id, 'User A sends message saved to Prisma');
  const msgA = sendMsgRes.data.message;

  // Retrieve Messages (User B reads)
  const getMsgsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/conversations/${conversation.id}/messages`,
    method: 'GET',
    headers: { Cookie: cookieB },
  });
  assert(
    getMsgsRes.status === 200 &&
      Array.isArray(getMsgsRes.data.messages) &&
      getMsgsRes.data.messages.some((m) => m.content === 'Hey Beta, how is Luang Prabang?'),
    'User B receives the exact message from database'
  );

  // Delete/Unsend Message
  const deleteMsgRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/messages/${msgA.id}`,
    method: 'DELETE',
    headers: { Cookie: cookieA },
  });
  assert(deleteMsgRes.status === 200 && deleteMsgRes.data.success, 'User A deletes/unsends their message');

  // 13. Security: Role Escalation Prevention
  console.log('\n--- 6. Security Hardening & Authorization Checks ---');
  const roleEscalateRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/profile',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: cookieA },
    },
    { role: 'admin' }
  );
  assert(
    roleEscalateRes.status === 200 && roleEscalateRes.data.user?.role !== 'admin',
    'Role escalation payload is stripped by Zod schema and cannot elevate privilege'
  );

  // 14. Security: Unauthorized Post Deletion (IDOR Protection)
  const unauthDelRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/posts/${post.id}`,
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

  // 17. Change Password & Auth Verification
  console.log('\n--- 8. Settings & Account Operations ---');
  const changePwdRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/change-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieB },
    },
    {
      currentPassword: 'password123',
      newPassword: 'newpassword456',
    }
  );
  assert(changePwdRes.status === 200 && changePwdRes.data.success, 'User B changes password');

  // Login with old password must fail
  const oldLoginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: userB.username,
      password: 'password123',
    }
  );
  assert(oldLoginRes.status === 401, 'Login with old password fails (401)');

  // Login with new password must succeed
  const newLoginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: userB.username,
      password: 'newpassword456',
    }
  );
  assert(newLoginRes.status === 200 && newLoginRes.data.user?.id, 'Login with new password succeeds (200)');

  // 18. Delete Account & Cleanup Verification
  const regCRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: userC_username,
      name: 'Temporary User C',
      password: 'tempPassword123',
      city: 'Champasak',
    }
  );
  assert(regCRes.status === 201, 'User C registers for deletion test');
  const cookieC = extractCookies(regCRes.headers) || `gukgic_token=${regCRes.data.token}`;

  const deleteAccountRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/delete-account',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieC },
    },
    { password: 'tempPassword123' }
  );
  assert(deleteAccountRes.status === 200 && deleteAccountRes.data.success, 'User C deletes account with password confirmation');

  // Verify User C is completely gone
  const loginDeletedRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { username: userC_username, password: 'tempPassword123' }
  );
  assert(loginDeletedRes.status === 401, 'Deleted user cannot log in');

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
