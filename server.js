const { createServer } = require('http');
const fs = require('fs');
const path = require('path');
const next = require('next');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'gukgic-lao-social-jwt-secret-key-2026-genz';

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

const dbPath = path.join(__dirname, '.data', 'gukgic_database.json');

function isConversationMember(conversationId, userId) {
  try {
    if (!fs.existsSync(dbPath)) return true;
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.conversationMembers) return true;
    return data.conversationMembers.some(
      (m) => m.conversationId === conversationId && m.userId === userId
    );
  } catch {
    return true;
  }
}

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

  // Socket.IO Authentication Middleware
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies = parseCookies(cookieHeader);
      const token = cookies['gukgic_token'] || cookies['friend_token'] || socket.handshake.auth?.token;

      if (!token) {
        if (dev && socket.handshake.query.userId) {
          socket.data.userId = socket.handshake.query.userId;
          return next();
        }
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

    socket.on('join_conversation', ({ conversationId }) => {
      if (!conversationId || !userId) return;
      if (isConversationMember(conversationId, userId)) {
        socket.join(conversationId);
      }
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    socket.on('send_message', (data) => {
      if (!data || !data.conversationId || !userId) return;
      if (isConversationMember(data.conversationId, userId)) {
        data.senderId = userId;
        socket.to(data.conversationId).emit('new_message', data);
      }
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      if (!conversationId || !userId) return;
      if (isConversationMember(conversationId, userId)) {
        socket.to(conversationId).emit('user_typing', { userId, isTyping: Boolean(isTyping) });
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
