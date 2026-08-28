import prisma from '@/lib/prisma';
import {
  User,
  Post,
  PostComment,
  FriendRequest,
  Conversation,
  Message,
  NotificationItem,
  Advertisement,
  FriendshipStatus,
  ReportItem,
  AuditLogItem,
  UserSettings,
} from '@/types';

const DEFAULT_SETTINGS: UserSettings = {
  profileVisibility: 'public',
  postVisibility: 'public',
  whoCanSendRequests: 'everyone',
  pushNotifications: true,
  messageNotifications: true,
  socialNotifications: true,
};

function parseJsonSafe<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export function formatUser(u: any): User {
  if (!u) throw new Error('User object cannot be null');
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    coverImage: u.coverImage || undefined,
    bio: u.bio || undefined,
    location: u.location || undefined,
    city: u.city || undefined,
    languages: parseJsonSafe<string[]>(u.languages, ['ລາວ', 'English']),
    interests: parseJsonSafe<string[]>(u.interests, ['Coffee', 'Music']),
    role: u.role || 'user',
    isBanned: Boolean(u.isBanned),
    isSuspended: Boolean(u.isSuspended),
    settings: parseJsonSafe<UserSettings>(u.settings, DEFAULT_SETTINGS),
    friendsCount: (u._count?.friendshipsAsUser1 || 0) + (u._count?.friendshipsAsUser2 || 0),
    postsCount: u._count?.posts || 0,
    isOnline: true,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
  };
}

const FALLBACK_USER: User = {
  id: 'user_unknown',
  username: 'unknown',
  name: 'GUKGIC User',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  languages: ['ລາວ'],
  interests: [],
  friendsCount: 0,
  postsCount: 0,
  isOnline: false,
  role: 'user',
  createdAt: new Date().toISOString(),
};

export function formatPost(p: any, currentUserId?: string): Post {
  return {
    id: p.id,
    userId: p.userId,
    content: p.content,
    mediaUrl: p.mediaUrl || undefined,
    mediaType: p.mediaType || undefined,
    author: p.author ? formatUser(p.author) : FALLBACK_USER,
    likesCount: p._count?.likes ?? p.likes?.length ?? 0,
    commentsCount: p._count?.comments ?? p.comments?.length ?? 0,
    sharesCount: 0,
    isLiked: currentUserId && p.likes ? p.likes.some((l: any) => l.userId === currentUserId) : false,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  };
}

export function formatComment(c: any): PostComment {
  return {
    id: c.id,
    postId: c.postId,
    userId: c.userId,
    content: c.content,
    author: c.author ? formatUser(c.author) : FALLBACK_USER,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
  };
}

export function formatMessage(m: any): Message {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    sender: m.sender ? formatUser(m.sender) : FALLBACK_USER,
    content: m.content,
    type: m.type as any,
    mediaUrl: m.mediaUrl || undefined,
    duration: m.duration || undefined,
    replyTo: m.replyToId ? { id: m.replyToId, senderName: '', content: '' } : undefined,
    isRead: Boolean(m.isRead),
    isDelivered: Boolean(m.isDelivered),
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
  };
}

export function formatNotification(n: any): NotificationItem {
  return {
    id: n.id,
    userId: n.userId,
    type: n.type as any,
    title: n.title,
    body: n.body,
    sender: n.sender ? formatUser(n.sender) : undefined,
    targetId: n.targetId || undefined,
    isRead: Boolean(n.isRead),
    createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : String(n.createdAt),
  };
}

export function formatFriendRequest(fr: any): FriendRequest {
  return {
    id: fr.id,
    senderId: fr.senderId,
    receiverId: fr.receiverId,
    sender: fr.sender ? formatUser(fr.sender) : FALLBACK_USER,
    receiver: fr.receiver ? formatUser(fr.receiver) : FALLBACK_USER,
    status: fr.status as any,
    createdAt: fr.createdAt instanceof Date ? fr.createdAt.toISOString() : String(fr.createdAt),
  };
}

export function formatAdvertisement(ad: any): Advertisement {
  return {
    id: ad.id,
    sponsor: ad.sponsor,
    title: ad.title,
    description: ad.description,
    imageUrl: ad.imageUrl,
    ctaText: ad.ctaText,
    targetUrl: ad.targetUrl,
    badge: ad.badge,
    isActive: Boolean(ad.isActive),
    impressions: ad.impressions || 0,
    clicks: ad.clicks || 0,
    createdAt: ad.createdAt instanceof Date ? ad.createdAt.toISOString() : String(ad.createdAt),
  };
}

export class RelationalDatabaseEngine {
  // --- Users & Authentication ---

  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            friendshipsAsUser1: true,
            friendshipsAsUser2: true,
            posts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return users.map(formatUser);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            friendshipsAsUser1: true,
            friendshipsAsUser2: true,
            posts: true,
          },
        },
      },
    });
    return user ? formatUser(user) : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      include: {
        _count: {
          select: {
            friendshipsAsUser1: true,
            friendshipsAsUser2: true,
            posts: true,
          },
        },
      },
    });
    return user ? formatUser(user) : null;
  }

  async getUserWithPassword(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
    });
  }

  async createUser(data: {
    username: string;
    name: string;
    passwordHash: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    city?: string;
    languages?: string[];
    interests?: string[];
    role?: string;
  }): Promise<User> {
    const created = await prisma.user.create({
      data: {
        username: data.username.toLowerCase().trim(),
        name: data.name.trim(),
        passwordHash: data.passwordHash,
        avatar:
          data.avatar ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.username)}`,
        coverImage: data.coverImage || null,
        bio: data.bio || null,
        location: data.location || null,
        city: data.city || null,
        languages: JSON.stringify(data.languages || ['ລາວ', 'English']),
        interests: JSON.stringify(data.interests || ['Coffee', 'Music']),
        role: data.role || 'user',
        settings: JSON.stringify(DEFAULT_SETTINGS),
      },
    });
    return formatUser(created);
  }

  async updateUser(
    id: string,
    updates: {
      name?: string;
      bio?: string | null;
      location?: string | null;
      city?: string | null;
      avatar?: string;
      coverImage?: string | null;
      languages?: string[];
      interests?: string[];
      settings?: UserSettings;
      role?: string;
      isBanned?: boolean;
      isSuspended?: boolean;
    }
  ): Promise<User | null> {
    const dataToUpdate: any = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name.trim();
    if (updates.bio !== undefined) dataToUpdate.bio = updates.bio;
    if (updates.location !== undefined) dataToUpdate.location = updates.location;
    if (updates.city !== undefined) dataToUpdate.city = updates.city;
    if (updates.avatar !== undefined) dataToUpdate.avatar = updates.avatar;
    if (updates.coverImage !== undefined) dataToUpdate.coverImage = updates.coverImage;
    if (updates.languages !== undefined) dataToUpdate.languages = JSON.stringify(updates.languages);
    if (updates.interests !== undefined) dataToUpdate.interests = JSON.stringify(updates.interests);
    if (updates.settings !== undefined) dataToUpdate.settings = JSON.stringify(updates.settings);
    if (updates.role !== undefined) dataToUpdate.role = updates.role;
    if (updates.isBanned !== undefined) dataToUpdate.isBanned = updates.isBanned;
    if (updates.isSuspended !== undefined) dataToUpdate.isSuspended = updates.isSuspended;

    try {
      const updated = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
        include: {
          _count: {
            select: {
              friendshipsAsUser1: true,
              friendshipsAsUser2: true,
              posts: true,
            },
          },
        },
      });
      return formatUser(updated);
    } catch {
      return null;
    }
  }

  async searchUsers(query: string, currentUserId?: string): Promise<User[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const users = await prisma.user.findMany({
      where: {
        AND: [
          currentUserId ? { id: { not: currentUserId } } : {},
          { isBanned: false },
          {
            OR: [
              { username: { contains: q } },
              { name: { contains: q } },
              { city: { contains: q } },
              { location: { contains: q } },
              { bio: { contains: q } },
              { interests: { contains: q } },
            ],
          },
        ],
      },
      include: {
        _count: {
          select: {
            friendshipsAsUser1: true,
            friendshipsAsUser2: true,
            posts: true,
          },
        },
      },
      take: 20,
    });

    return users.map(formatUser);
  }

  // --- Friends & Social Relationships ---

  async getFriends(userId: string): Promise<User[]> {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          include: {
            _count: {
              select: {
                friendshipsAsUser1: true,
                friendshipsAsUser2: true,
                posts: true,
              },
            },
          },
        },
        user2: {
          include: {
            _count: {
              select: {
                friendshipsAsUser1: true,
                friendshipsAsUser2: true,
                posts: true,
              },
            },
          },
        },
      },
    });

    return friendships.map((f) => {
      const friend = f.user1Id === userId ? f.user2 : f.user1;
      return formatUser(friend);
    });
  }

  async getPendingRequests(userId: string): Promise<FriendRequest[]> {
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return requests.map(formatFriendRequest);
  }

  async getSentRequests(userId: string): Promise<FriendRequest[]> {
    const requests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'pending',
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return requests.map(formatFriendRequest);
  }

  async getFriendshipStatus(user1Id: string, user2Id: string): Promise<FriendshipStatus> {
    if (user1Id === user2Id) return 'none';

    // 1. Check blocked
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: user1Id, blockedId: user2Id },
          { blockerId: user2Id, blockedId: user1Id },
        ],
      },
    });
    if (block) return 'blocked';

    // 2. Check friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });
    if (friendship) return 'friends';

    // 3. Check pending requests
    const sentReq = await prisma.friendRequest.findFirst({
      where: { senderId: user1Id, receiverId: user2Id, status: 'pending' },
    });
    if (sentReq) return 'pending';

    const receivedReq = await prisma.friendRequest.findFirst({
      where: { senderId: user2Id, receiverId: user1Id, status: 'pending' },
    });
    if (receivedReq) return 'incoming';

    return 'none';
  }

  async sendFriendRequest(senderId: string, receiverId: string): Promise<FriendRequest> {
    if (senderId === receiverId) {
      throw new Error('Cannot send friend request to yourself');
    }

    const status = await this.getFriendshipStatus(senderId, receiverId);
    if (status === 'blocked') throw new Error('Cannot interact with blocked user');
    if (status === 'friends') throw new Error('Already friends');
    if (status === 'pending') throw new Error('Friend request already sent');
    if (status === 'incoming') {
      // Auto-accept if they already sent us a request
      const existing = await prisma.friendRequest.findFirst({
        where: { senderId: receiverId, receiverId: senderId, status: 'pending' },
        include: { sender: true, receiver: true },
      });
      if (existing) {
        await this.acceptFriendRequest(existing.id, senderId);
        return formatFriendRequest(existing);
      }
    }

    // Check target user's privacy setting for friend requests
    const targetUser = await prisma.user.findUnique({ where: { id: receiverId } });
    if (targetUser) {
      const targetSettings = parseJsonSafe<UserSettings>(targetUser.settings, DEFAULT_SETTINGS);
      if (targetSettings.whoCanSendRequests === 'none') {
        throw new Error('This user is not accepting friend requests');
      }
    }

    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Create Notification
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    await prisma.notification.create({
      data: {
        userId: receiverId,
        senderId,
        type: 'friend_request',
        title: 'ຄຳຂໍເປັນເພື່ອນໃໝ່',
        body: `${sender?.name || 'ມີຜູ້ໃຊ້'} ໄດ້ສົ່ງຄຳຂໍເປັນເພື່ອນຫາເຈົ້າ`,
        targetId: request.id,
      },
    });

    return formatFriendRequest(request);
  }

  async acceptFriendRequest(requestId: string, currentUserId: string): Promise<boolean> {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== currentUserId || request.status !== 'pending') {
      return false;
    }

    const u1 = request.senderId < request.receiverId ? request.senderId : request.receiverId;
    const u2 = request.senderId < request.receiverId ? request.receiverId : request.senderId;

    await prisma.$transaction([
      prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
      }),
      prisma.friendship.upsert({
        where: {
          user1Id_user2Id: { user1Id: u1, user2Id: u2 },
        },
        create: { user1Id: u1, user2Id: u2 },
        update: {},
      }),
    ]);

    // Send notification to the requester
    const receiver = await prisma.user.findUnique({ where: { id: currentUserId } });
    await prisma.notification.create({
      data: {
        userId: request.senderId,
        senderId: currentUserId,
        type: 'friend_accept',
        title: 'ຕອບຮັບຄຳຂໍເປັນເພື່ອນແລ້ວ',
        body: `${receiver?.name || 'ໝູ່ຂອງທ່ານ'} ໄດ້ຕອບຮັບຄຳຂໍເປັນເພື່ອນຂອງທ່ານແລ້ວ`,
      },
    });

    return true;
  }

  async rejectFriendRequest(requestId: string, currentUserId: string): Promise<boolean> {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== currentUserId) return false;

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });
    return true;
  }

  async cancelFriendRequest(requestId: string, currentUserId: string): Promise<boolean> {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.senderId !== currentUserId) return false;

    await prisma.friendRequest.delete({ where: { id: requestId } });
    return true;
  }

  async removeFriend(userId: string, friendId: string): Promise<boolean> {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId },
        ],
      },
    });
    return true;
  }

  async blockUser(blockerId: string, blockedId: string): Promise<boolean> {
    if (blockerId === blockedId) return false;

    await prisma.$transaction([
      prisma.block.upsert({
        where: {
          blockerId_blockedId: { blockerId, blockedId },
        },
        create: { blockerId, blockedId },
        update: {},
      }),
      // Remove any friendships
      prisma.friendship.deleteMany({
        where: {
          OR: [
            { user1Id: blockerId, user2Id: blockedId },
            { user1Id: blockedId, user2Id: blockerId },
          ],
        },
      }),
      // Remove any pending friend requests
      prisma.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: blockerId, receiverId: blockedId },
            { senderId: blockedId, receiverId: blockerId },
          ],
        },
      }),
    ]);

    return true;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    await prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });
    return true;
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const blocks = await prisma.block.findMany({
      where: { blockerId: userId },
      include: { blocked: true },
    });
    return blocks.map((b) => formatUser(b.blocked));
  }

  async discoverFriends(
    userId?: string,
    filters?: { city?: string; interest?: string; search?: string }
  ): Promise<User[]> {
    let excludedUserIds: string[] = [];
    if (userId) {
      excludedUserIds.push(userId);

      // Exclude existing friends
      const friendships = await prisma.friendship.findMany({
        where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      });
      friendships.forEach((f) => {
        excludedUserIds.push(f.user1Id === userId ? f.user2Id : f.user1Id);
      });

      // Exclude blocked users
      const blocks = await prisma.block.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      });
      blocks.forEach((b) => {
        excludedUserIds.push(b.blockerId === userId ? b.blockedId : b.blockerId);
      });
    }

    const whereClause: any = {
      isBanned: false,
      ...(excludedUserIds.length > 0 ? { id: { notIn: excludedUserIds } } : {}),
    };

    if (filters?.city) {
      whereClause.city = { contains: filters.city };
    }

    if (filters?.interest) {
      whereClause.interests = { contains: filters.interest };
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      whereClause.OR = [
        { username: { contains: q } },
        { name: { contains: q } },
        { bio: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            friendshipsAsUser1: true,
            friendshipsAsUser2: true,
            posts: true,
          },
        },
      },
      take: 20,
    });

    return users.map(formatUser);
  }

  // --- Posts & Feed ---

  async getPosts(
    currentUserId?: string,
    options?: { limit?: number; cursor?: string; userId?: string }
  ): Promise<Post[]> {
    const limit = options?.limit || 20;

    // Get blocked user IDs if user is logged in
    let blockedIds: string[] = [];
    if (currentUserId) {
      const blocks = await prisma.block.findMany({
        where: {
          OR: [{ blockerId: currentUserId }, { blockedId: currentUserId }],
        },
      });
      blockedIds = blocks.map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId));
    }

    const posts = await prisma.post.findMany({
      where: {
        isHidden: false,
        ...(options?.userId ? { userId: options.userId } : {}),
        ...(blockedIds.length > 0 ? { userId: { notIn: blockedIds } } : {}),
      },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(options?.cursor ? { skip: 1, cursor: { id: options.cursor } } : {}),
    });

    return posts.map((p) => formatPost(p, currentUserId));
  }

  async getPostById(id: string, currentUserId?: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return post ? formatPost(post, currentUserId) : null;
  }

  async createPost(
    userId: string,
    content: string,
    mediaUrl?: string | null,
    mediaType?: string | null
  ): Promise<Post> {
    const created = await prisma.post.create({
      data: {
        userId,
        content: content.trim(),
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || (mediaUrl ? 'image' : null),
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    return formatPost(created, userId);
  }

  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return false;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (post.userId !== userId && user?.role !== 'admin' && user?.role !== 'moderator') {
      return false;
    }

    await prisma.post.delete({ where: { id: postId } });
    return true;
  }

  async toggleLikePost(
    postId: string,
    userId: string
  ): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    let isLiked = false;
    if (existing) {
      await prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });
      isLiked = false;
    } else {
      await prisma.postLike.create({
        data: { postId, userId },
      });
      isLiked = true;

      // Notify post author if not self
      if (post.userId !== userId) {
        const liker = await prisma.user.findUnique({ where: { id: userId } });
        await prisma.notification.create({
          data: {
            userId: post.userId,
            senderId: userId,
            type: 'post_like',
            title: 'ຖືກໃຈໂພສ',
            body: `${liker?.name || 'ມີຜູ້ໃຊ້'} ໄດ້ຖືກໃຈໂພສຂອງທ່ານ`,
            targetId: postId,
          },
        });
      }
    }

    const likesCount = await prisma.postLike.count({ where: { postId } });
    return { isLiked, likesCount };
  }

  async getComments(postId: string): Promise<PostComment[]> {
    const comments = await prisma.postComment.findMany({
      where: { postId, isHidden: false },
      include: { author: true },
      orderBy: { createdAt: 'asc' },
    });
    return comments.map(formatComment);
  }

  async addComment(postId: string, userId: string, content: string): Promise<PostComment> {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    const comment = await prisma.postComment.create({
      data: {
        postId,
        userId,
        content: content.trim(),
      },
      include: { author: true },
    });

    // Notify author if not self
    if (post.userId !== userId) {
      const commenter = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.notification.create({
        data: {
          userId: post.userId,
          senderId: userId,
          type: 'post_comment',
          title: 'ມີຄອມເມັ້ນໃໝ່',
          body: `${commenter?.name || 'ມີຜູ້ໃຊ້'} ໄດ້ຄອມເມັ້ນໃນໂພສຂອງທ່ານ`,
          targetId: postId,
        },
      });
    }

    return formatComment(comment);
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const comment = await prisma.postComment.findUnique({ where: { id: commentId } });
    if (!comment) return false;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (comment.userId !== userId && user?.role !== 'admin') {
      return false;
    }

    await prisma.postComment.delete({ where: { id: commentId } });
    return true;
  }

  // --- Conversations & Messaging ---

  async getConversations(userId: string): Promise<Conversation[]> {
    const convs = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return convs.map((c) => {
      const lastMsg = c.messages[0];
      return {
        id: c.id,
        participants: c.members.map((m) => formatUser(m.user)),
        lastMessage: lastMsg ? formatMessage(lastMsg) : undefined,
        unreadCount: 0,
        updatedAt: c.updatedAt.toISOString(),
      };
    });
  }

  async getOrCreateConversation(user1Id: string, user2Id: string): Promise<{ id: string }> {
    // Find if already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { members: { some: { userId: user1Id } } },
          { members: { some: { userId: user2Id } } },
        ],
      },
    });

    if (existing) return { id: existing.id };

    const conv = await prisma.conversation.create({
      data: {
        members: {
          create: [{ userId: user1Id }, { userId: user2Id }],
        },
      },
    });

    return { id: conv.id };
  }

  async getConversationById(convId: string, userId: string): Promise<Conversation | null> {
    const conv = await prisma.conversation.findUnique({
      where: { id: convId },
      include: {
        members: { include: { user: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    if (!conv) return null;
    const isMember = conv.members.some((m) => m.userId === userId);
    if (!isMember) return null;

    const lastMsg = conv.messages[0];

    return {
      id: conv.id,
      participants: conv.members.map((m) => formatUser(m.user)),
      lastMessage: lastMsg ? formatMessage(lastMsg) : undefined,
      unreadCount: 0,
      updatedAt: conv.updatedAt.toISOString(),
    };
  }

  async getMessages(
    convId: string,
    userId: string,
    options?: { limit?: number; cursor?: string }
  ): Promise<Message[]> {
    // Verify membership
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId: convId, userId },
      },
    });
    if (!member) throw new Error('Unauthorized to view this conversation');

    const limit = options?.limit || 50;
    const messages = await prisma.message.findMany({
      where: { conversationId: convId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
      take: limit,
      ...(options?.cursor ? { skip: 1, cursor: { id: options.cursor } } : {}),
    });

    // Mark unread messages as read for receiver
    await prisma.message.updateMany({
      where: {
        conversationId: convId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages.map(formatMessage);
  }

  async createMessage(
    convId: string,
    senderId: string,
    data: {
      content: string;
      type?: 'text' | 'voice' | 'image';
      mediaUrl?: string | null;
      duration?: number | null;
      replyToId?: string | null;
    }
  ): Promise<Message> {
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId: convId, userId: senderId },
      },
    });
    if (!member) throw new Error('Unauthorized to send messages to this conversation');

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: convId,
          senderId,
          content: data.content,
          type: data.type || 'text',
          mediaUrl: data.mediaUrl || null,
          duration: data.duration || null,
          replyToId: data.replyToId || null,
          isRead: false,
          isDelivered: true,
        },
        include: { sender: true },
      }),
      prisma.conversation.update({
        where: { id: convId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return formatMessage(message);
  }

  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const msg = await prisma.message.findUnique({ where: { id: messageId } });
    if (!msg || msg.senderId !== userId) return false;

    await prisma.message.delete({ where: { id: messageId } });
    return true;
  }

  // --- Notifications ---

  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const notifs = await prisma.notification.findMany({
      where: { userId },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return notifs.map(formatNotification);
  }

  async markNotificationRead(id: string, userId: string): Promise<boolean> {
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // --- Advertisements ---

  async getAds(): Promise<Advertisement[]> {
    const ads = await prisma.advertisement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return ads.map(formatAdvertisement);
  }

  async getAllAds(): Promise<Advertisement[]> {
    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return ads.map(formatAdvertisement);
  }

  async createAd(data: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>): Promise<Advertisement> {
    const created = await prisma.advertisement.create({
      data: {
        sponsor: data.sponsor,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ctaText: data.ctaText,
        targetUrl: data.targetUrl,
        badge: data.badge || 'Sponsored',
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return formatAdvertisement(created);
  }

  async updateAd(id: string, updates: Partial<Advertisement>): Promise<Advertisement | null> {
    try {
      const updated = await prisma.advertisement.update({
        where: { id },
        data: updates as any,
      });
      return formatAdvertisement(updated);
    } catch {
      return null;
    }
  }

  async deleteAd(id: string): Promise<boolean> {
    try {
      await prisma.advertisement.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // --- Moderation & Reports ---

  async report(data: {
    targetType: 'user' | 'post' | 'comment' | 'message';
    targetId: string;
    reporterId: string;
    reason: string;
    details?: string | null;
  }): Promise<ReportItem> {
    const created = await prisma.report.create({
      data: {
        targetType: data.targetType,
        targetId: data.targetId,
        reporterId: data.reporterId,
        reason: data.reason,
        details: data.details || null,
        status: 'pending',
        actionTaken: 'none',
      },
      include: { reporter: true },
    });

    return {
      id: created.id,
      targetType: created.targetType as any,
      targetId: created.targetId,
      reporterId: created.reporterId,
      reporter: created.reporter ? formatUser(created.reporter) : undefined,
      reason: created.reason,
      details: created.details || undefined,
      status: created.status as any,
      actionTaken: created.actionTaken as any,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async getReports(): Promise<ReportItem[]> {
    const reports = await prisma.report.findMany({
      include: { reporter: true },
      orderBy: { createdAt: 'desc' },
    });

    return reports.map((r) => ({
      id: r.id,
      targetType: r.targetType as any,
      targetId: r.targetId,
      reporterId: r.reporterId,
      reporter: r.reporter ? formatUser(r.reporter) : undefined,
      reason: r.reason,
      details: r.details || undefined,
      status: r.status as any,
      actionTaken: r.actionTaken as any,
      resolvedBy: r.resolvedBy || undefined,
      resolvedAt: r.resolvedAt?.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async resolveReport(id: string, actionTaken: string, adminId: string): Promise<boolean> {
    try {
      await prisma.report.update({
        where: { id },
        data: {
          status: 'resolved',
          actionTaken,
          resolvedBy: adminId,
          resolvedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async dismissReport(id: string, adminId: string): Promise<boolean> {
    try {
      await prisma.report.update({
        where: { id },
        data: {
          status: 'dismissed',
          resolvedBy: adminId,
          resolvedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Audit Logs ---

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return logs.map((l) => ({
      id: l.id,
      adminId: l.adminId,
      adminName: l.adminName,
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      details: l.details,
      createdAt: l.createdAt.toISOString(),
    }));
  }

  async addAuditLog(log: {
    adminId: string;
    adminName: string;
    action: string;
    targetType: string;
    targetId: string;
    details: string;
  }): Promise<AuditLogItem> {
    const created = await prisma.auditLog.create({
      data: log,
    });
    return {
      id: created.id,
      ...log,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async getAdminStats() {
    const [totalUsers, totalPosts, pendingReports, activeAds] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.advertisement.count({ where: { isActive: true } }),
    ]);

    return {
      totalUsers,
      totalPosts,
      pendingReports,
      activeAds,
    };
  }
}

export const db = new RelationalDatabaseEngine();
export default db;
