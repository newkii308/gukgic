const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
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
    },
  });

  const onlineUsers = new Map(); // socket.id -> userId

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(socket.id, userId);
      io.emit('user_online', { userId, isOnline: true });
    }

    socket.on('join_conversation', ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', ({ conversationId }) => {
      socket.leave(conversationId);
    });

    socket.on('send_message', (data) => {
      // Broadcast to room
      socket.to(data.conversationId).emit('new_message', data);
    });

    socket.on('typing', ({ conversationId, isTyping, userId }) => {
      socket.to(conversationId).emit('user_typing', { userId, isTyping });
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
    console.log(`> Friend Social App ready on http://${hostname}:${port}`);
  });
});
