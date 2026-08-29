const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || (dev ? 'gukgic-dev-jwt-secret-key-change-in-prod-2026' : null);

const prisma = new PrismaClient();
const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

async function isConversationMember(conversationId, userId) {
  try {
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
    return Boolean(member);
  } catch (err) {
    console.error('Error verifying conversation membership:', err);
    return false;
  }
}

app.prepare().then(async () => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
      await handle(req, res, {
        pathname: parsedUrl.pathname,
        query: Object.fromEntries(parsedUrl.searchParams.entries()),
      });
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Socket.IO Server configuration
  const io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Optional Redis Adapter for multi-instance horizontal scaling
  if (process.env.REDIS_URL) {
    try {
      const pubClient = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
      const subClient = pubClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log('✓ Socket.IO Redis Adapter initialized successfully');
    } catch (err) {
      console.warn('⚠️ Redis not available for Socket adapter, running in single-node mode');
    }
  }

  const onlineUsers = new Map(); // socket.id -> userId

  // Strict JWT Authentication Middleware for Socket.IO
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies = parseCookies(cookieHeader);
      const token = cookies['gukgic_token'] || cookies['friend_token'] || socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      if (!JWT_SECRET) {
        return next(new Error('JWT_SECRET not configured'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.userId) {
        return next(new Error('Invalid token payload'));
      }

      socket.data.userId = decoded.userId;
      socket.data.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.set(socket.id, userId);
      io.emit('user_online', { userId, isOnline: true });
    }

    // Join conversation room (verifying database membership first)
    socket.on('join_conversation', async ({ conversationId }) => {
      if (!conversationId || !userId) return;
      const isMember = await isConversationMember(conversationId, userId);
      if (isMember) {
        socket.join(conversationId);
      }
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    // Typing event indicator
    socket.on('typing', async ({ conversationId, isTyping }) => {
      if (!conversationId || !userId) return;
      const isMember = await isConversationMember(conversationId, userId);
      if (isMember) {
        socket.to(conversationId).emit('user_typing', { userId, isTyping: Boolean(isTyping) });
      }
    });

    // Realtime broadcast of canonical persisted message (Message is already persisted by HTTP API)
    socket.on('broadcast_message', async (data) => {
      if (!data || !data.conversationId || !userId) return;
      const isMember = await isConversationMember(data.conversationId, userId);
      if (isMember) {
        socket.to(data.conversationId).emit('new_message', data);
      }
    });

    socket.on('disconnect', () => {
      const uId = onlineUsers.get(socket.id);
      if (uId) {
        onlineUsers.delete(socket.id);
        io.emit('user_online', { userId: uId, isOnline: false });
      }
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> GUKGIC Social App ready on http://${hostname}:${port}`);
  });
});
