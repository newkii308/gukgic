const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'gukgic-lao-social-jwt-secret-key-2026-genz';

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

app.prepare().then(() => {
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

  const onlineUsers = new Map(); // socket.id -> userId

  // Socket.IO Authentication Middleware (Strict JWT Session)
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

    socket.on('join_conversation', async ({ conversationId }) => {
      if (!conversationId || !userId) return;
      try {
        // Verify user is a verified member of this conversation before joining room
        const membership = await prisma.conversationMember.findUnique({
          where: {
            conversationId_userId: { conversationId, userId },
          },
        });
        if (membership) {
          socket.join(conversationId);
        }
      } catch (err) {
        console.error('Error joining conversation room:', err);
      }
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    socket.on('send_message', async (data) => {
      if (!data || !data.conversationId || !userId) return;

      try {
        // Verify sender is a conversation member
        const membership = await prisma.conversationMember.findUnique({
          where: {
            conversationId_userId: { conversationId: data.conversationId, userId },
          },
        });
        if (!membership) return;

        // Force sender identity to authenticated socket session
        data.senderId = userId;

        // Broadcast verified message to conversation room
        socket.to(data.conversationId).emit('new_message', data);
      } catch (err) {
        console.error('Error handling socket send_message:', err);
      }
    });

    socket.on('typing', async ({ conversationId, isTyping }) => {
      if (!conversationId || !userId) return;
      try {
        // Verify conversation membership before broadcasting typing
        const membership = await prisma.conversationMember.findUnique({
          where: {
            conversationId_userId: { conversationId, userId },
          },
        });
        if (membership) {
          socket.to(conversationId).emit('user_typing', { userId, isTyping: Boolean(isTyping) });
        }
      } catch (err) {
        console.error('Error handling socket typing event:', err);
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
