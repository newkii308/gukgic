// End-to-End Social System Integration Test
const http = require('http');

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

async function runTests() {
  console.log('🧪 Starting GUKGIC User Social App Verification...\n');
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

  // 1. Test Login with default seed user
  console.log('--- Phase 1: Authentication & Sessions ---');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { username: 'khampheng', password: 'password123' }
  );
  assert(loginRes.status === 200 && loginRes.data.user, 'Login with seed account succeeds');
  const token = loginRes.data.token;
  const cookieHeader = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : `gukgic_token=${token}`;

  // 2. Test Session Verification
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
      Authorization: `Bearer ${token}`,
    },
  });
  assert(meRes.status === 200 && meRes.data.user.username === 'khampheng', 'Get current session returns authenticated user');

  // 3. Test Register New User
  const testUser = `test_${Date.now()}`;
  const regRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      username: testUser,
      name: 'Test Lao User',
      password: 'password123',
      city: 'Vientiane',
      interests: ['Coffee', 'Music'],
    }
  );
  assert(regRes.status === 201 && regRes.data.user.username === testUser, 'Register new user persists to database');
  const newCookie = regRes.headers['set-cookie'] ? regRes.headers['set-cookie'][0] : `gukgic_token=${regRes.data.token}`;

  // 4. Test Create Post
  console.log('\n--- Phase 2: Feed, Posts & Interactions ---');
  const createPostRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: newCookie,
      },
    },
    { content: 'ສະບາຍດີ! ທົດສອບໂພສໃໝ່ຈາກລະບົບຈິງ 🇱🇦' }
  );
  assert(createPostRes.status === 201 && createPostRes.data.post.content.includes('ສະບາຍດີ'), 'Create post writes to database');
  const createdPostId = createPostRes.data.post.id;

  // 5. Test Like Post
  const likeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/posts/${createdPostId}/like`,
    method: 'POST',
    headers: { Cookie: cookieHeader },
  });
  assert(likeRes.status === 200 && likeRes.data.isLiked === true, 'Toggle like stores relational like in database');

  // 6. Test Add Comment
  const commentRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/posts/${createdPostId}/comments`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    },
    { content: 'ຍິນດີຕ້ອນຮັບສູ່ GUKGIC!' }
  );
  assert(commentRes.status === 201 && commentRes.data.comment.content.includes('ຍິນດີຕ້ອນຮັບ'), 'Add comment links to post in database');

  // 7. Test Friend Request
  console.log('\n--- Phase 3: Friends Hub & Requests ---');
  const friendReqRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/friends/request',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: newCookie,
      },
    },
    { targetUserId: 'user_alouny' }
  );
  assert(friendReqRes.status === 201 && friendReqRes.data.request.status === 'pending', 'Send friend request generates pending request');

  // 8. Test Search Users
  console.log('\n--- Phase 4: Search & Discovery ---');
  const searchRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/search?q=Alouny',
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });
  assert(searchRes.status === 200 && searchRes.data.users.length > 0, 'Search matches users in database');

  // 9. Test Conversations & Messaging
  console.log('\n--- Phase 5: Messaging & Conversations ---');
  const convRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/conversations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    },
    { targetUserId: 'user_alouny' }
  );
  assert(convRes.status === 200 && convRes.data.conversation.id, 'Get or create conversation returns active chat');
  const convId = convRes.data.conversation.id;

  const msgRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/conversations/${convId}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    },
    { content: 'ສະບາຍດີ! ຂໍ້ຄວາມທົດສອບ' }
  );
  assert(msgRes.status === 201 && msgRes.data.message.content.includes('ສະບາຍດີ'), 'Send message stores to conversation in database');

  // 10. Test Notifications
  console.log('\n--- Phase 6: Notifications & Profile ---');
  const notifRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/notifications',
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });
  assert(notifRes.status === 200 && Array.isArray(notifRes.data.notifications), 'Notifications fetched from database');

  // 11. Test Profile Update
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/profile',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: newCookie,
      },
    },
    { bio: 'Updated Lao Bio ☕🇱🇦' }
  );
  assert(updateRes.status === 200 && updateRes.data.user.bio.includes('Updated Lao Bio'), 'Update profile persists in database');

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
