import fs from 'fs';
import path from 'path';
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
  UserSettings
} from '@/types';

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>;
  friendships: { user1Id: string; user2Id: string; createdAt: string }[];
  friendRequests: FriendRequest[];
  posts: Post[];
  comments: PostComment[];
  conversations: Conversation[];
  messages: Message[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  blocks: { blockerId: string; blockedId: string; createdAt: string }[];
  ads: Advertisement[];
  auditLogs: AuditLogItem[];
}

const DB_FILE_PATH = path.join(process.cwd(), '.data', 'db.json');

const DEFAULT_SETTINGS: UserSettings = {
  profileVisibility: 'public',
  postVisibility: 'public',
  whoCanSendRequests: 'everyone',
  pushNotifications: true,
  messageNotifications: true,
  socialNotifications: true,
};

const INITIAL_USERS: User[] = [
  {
    id: 'user_me',
    username: 'khampheng',
    name: 'Khampheng (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສະບາຍດີ! ມັກຊອກຫາເພື່ອນໃໝ່ ຖ່າຍຮູບ ແລະ ຮ້ານກາເຟງາມໆໃນວຽງຈັນ ☕🇱🇦',
    location: 'Vientiane Capital',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Photography', 'Coffee', 'Music', 'Tech', 'Travel'],
    friendsCount: 3,
    postsCount: 2,
    isOnline: true,
    role: 'admin', // System Administrator for testing /admin
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 0,
  },
  {
    id: 'user_1',
    username: 'alouny_s',
    name: 'Alouny Souvannavong',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສະບາຍດີທຸກຄົນ! ມັກຖ່າຍຮູບຟິມ & ຊອກຫາຮ້ານກາເຟໃໝ່ໆ 📸✨',
    location: 'Vientiane, Laos',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Photography', 'Cafe hopping', 'Indie Music', 'Art'],
    friendsCount: 142,
    postsCount: 18,
    isOnline: true,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 12,
  },
  {
    id: 'user_2',
    username: 'khamla_dev',
    name: 'Khamla Phommachan',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    bio: 'Junior Frontend Dev ຢູ່ຫຼວງພະບາງ ມັກປັ່ນລົດຖີບຍາມແລງ 🚴‍♂️💻☕',
    location: 'Luang Prabang',
    city: 'Luang Prabang',
    languages: ['ລາວ', 'English', '中文'],
    interests: ['Coding', 'Cycling', 'Tech', 'Gaming', 'Coffee'],
    friendsCount: 88,
    postsCount: 9,
    isOnline: true,
    lastSeen: 'ມື້ກີ້ນີ້',
    role: 'moderator',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 5,
  },
  {
    id: 'user_3',
    username: 'soupha_k',
    name: 'Souphaphone Keomany',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    bio: 'Gen Z Vientiane, ມັກແຕ່ງໂຕ & ຟັງເພງ K-Pop 🎧 ໃຜມັກເຕັ້ນທັກມາລົມກັນໄດ້!',
    location: 'Vientiane',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', '한국어'],
    interests: ['Fashion', 'K-Pop', 'Dance', 'Cafe hopping', 'Travel'],
    friendsCount: 310,
    postsCount: 42,
    isOnline: false,
    lastSeen: '15 ນາທີກ່ອນ',
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 18,
  },
  {
    id: 'user_4',
    username: 'sengchanh_camp',
    name: 'Sengchanh Inthavong',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສາຍແຄັມປິ້ງປາກເຊ ໃຜມັກທ່ຽວທຳມະຊາດ & ດີດກີຕ້າ ທັກມາໄດ້ເດີ້ ⛺🌲🎸',
    location: 'Pakse, Champasak',
    city: 'Champasak',
    languages: ['ລາວ', 'English', 'Tiếng Việt'],
    interests: ['Camping', 'Hiking', 'Acoustic Guitar', 'Nature', 'Photography'],
    friendsCount: 95,
    postsCount: 14,
    isOnline: false,
    lastSeen: '2 ຊົ່ວໂມງກ່ອນ',
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 3,
  },
  {
    id: 'user_5',
    username: 'vila_gamer',
    name: 'Vilaphone Saysana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    bio: 'ຫາໝູ່ຕີເກມ Valorant & ເຂົ້າຢິມ 💪🎮 ມັກລົມເລື່ອງອານິເມະ',
    location: 'Savannakhet',
    city: 'Savannakhet',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Gaming', 'Anime', 'Valorant', 'Fitness', 'Movies'],
    friendsCount: 180,
    postsCount: 22,
    isOnline: true,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    mutualFriendsCount: 8,
  }
];

const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad_1',
    sponsor: 'Cafe Sinouk Laos',
    title: 'ກາເຟລາວແທ້ 100% ພ້ອມໂປຣໂມຊັ່ນສຸດພິເສດ!',
    description: 'ພົບກັບເມນູ Dirty Coffee ໃໝ່ລ່າສຸດ ພ້ອມສ່ວນຫຼຸດ 20% ສຳລັບສະມາຊິກ GUKGIC App ພຽງໂຊໂປຣໄຟລ໌!',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    ctaText: 'ເບິ່ງສາຂາໃກ້ເຈົ້າ',
    targetUrl: 'https://sinouk-coffee.com',
    badge: 'ໂຄສະນາ',
    isActive: true,
    impressions: 1240,
    clicks: 185,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ad_2',
    sponsor: 'Lao Youth Tech Summit 2026',
    title: 'ງານລວມພົນຄົນເທັກໂນໂລຢີ ແລະ Gen Z ທີ່ໃຫຍ່ທີ່ສຸດໃນວຽງຈັນ',
    description: 'ຮຽນຮູ້ AI, Web3, Startup ແລະ ພົບກັບ Creators ຊື່ດັງທົ່ວປະເທດລາວ. ເປີດຮັບລົງທະບຽນຟຣີແລ້ວມື້ນີ້!',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    ctaText: 'ລົງທະບຽນຟຣີ',
    targetUrl: 'https://laotechsummit.la',
    badge: 'Sponsored',
    isActive: true,
    impressions: 3420,
    clicks: 610,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    author: INITIAL_USERS[1],
    content: 'ມື້ນີ້ມານັ່ງເຮັດວຽກຢູ່ຮ້ານກາເຟແຖວຮິມຂອງ ບັນຍາກາດດີຫຼາຍລົມເຢັນສະບາຍ ໃຜຢູ່ແຖວນີ້ຢາກມານັ່ງລົມກັນທັກມາໄດ້ເດີ້! ☕🌅',
    mediaUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 24,
    commentsCount: 5,
    sharesCount: 2,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_2',
    userId: 'user_2',
    author: INITIAL_USERS[2],
    content: 'ປັ່ນລົດຖີບຂຶ້ນພູສີຍາມແລງ ຫຼວງພະບາງງາມສະເໝີເລີຍ ມີໃຜມັກປັ່ນລົດຖີບທ່ຽວຄືກັນແດ່? 🚴‍♀️✨',
    mediaUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 6,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_3',
    userId: 'user_5',
    author: INITIAL_USERS[5],
    content: 'ຫາໝູ່ຕີ Valorant ແລງນີ້ 5 ຄົນ Rank Gold-Plat ໃຜວ່າງແດ່ທັກ Discord ມາໄດ້ເລີຍ! 🎮🔥',
    likesCount: 15,
    commentsCount: 11,
    sharesCount: 1,
    isLiked: false,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_COMMENTS: PostComment[] = [
  {
    id: 'comm_1',
    postId: 'post_1',
    userId: 'user_3',
    author: INITIAL_USERS[3],
    content: 'ຮ້ານໃດນໍ້ນ້ອງອາລຸນີ? ບັນຍາກາດຄືເປັນຕາໄປແທ້ 😍',
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'comm_2',
    postId: 'post_1',
    userId: 'user_1',
    author: INITIAL_USERS[1],
    content: '@soupha_k ຮ້ານແຖວສວນເຈົ້າອະນຸວົງເຈົ້າ ເອື້ອຍມາເລີຍ!',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: 'comm_3',
    postId: 'post_2',
    userId: 'user_4',
    author: INITIAL_USERS[4],
    content: 'ຫຼວງພະບາງຍາມນີ້ໜ້າໄປທ່ຽວແທ້ໆ 🚴‍♂️',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participants: [INITIAL_USERS[0], INITIAL_USERS[1]],
    lastMessage: {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'user_1',
      sender: INITIAL_USERS[1],
      content: 'ມື້ອື່ນເຈົ້າວ່າງບໍ່? ໄປຮ້ານກາເຟນຳກັນ!',
      type: 'text',
      isRead: false,
      isDelivered: true,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv_2',
    participants: [INITIAL_USERS[0], INITIAL_USERS[2]],
    lastMessage: {
      id: 'msg_voice_1',
      conversationId: 'conv_2',
      senderId: 'user_2',
      sender: INITIAL_USERS[2],
      content: 'ສຽງຂໍ້ຄວາມ (0:08)',
      type: 'voice',
      mediaUrl: 'sample_audio',
      duration: 8,
      isRead: true,
      isDelivered: true,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'user_me',
    sender: INITIAL_USERS[0],
    content: 'ສະບາຍດີອາລຸນີ! ເຫັນໂພສຮູບກາເຟງາມຫຼາຍ ຢູ່ຮ້ານໃດຫວາ?',
    type: 'text',
    isRead: true,
    isDelivered: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_2',
    conversationId: 'conv_1',
    senderId: 'user_1',
    sender: INITIAL_USERS[1],
    content: 'ສະບາຍດີຄຳແພງ! ຢູ່ຮ້ານແຖວຮິມຂອງເດີ້ ກາເຟແຊບຫຼາຍ',
    type: 'text',
    isRead: true,
    isDelivered: true,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_3',
    conversationId: 'conv_1',
    senderId: 'user_1',
    sender: INITIAL_USERS[1],
    content: 'ມື້ອື່ນເຈົ້າວ່າງບໍ່? ໄປຮ້ານກາເຟນຳກັນ!',
    type: 'text',
    isRead: false,
    isDelivered: true,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_voice_1',
    conversationId: 'conv_2',
    senderId: 'user_2',
    sender: INITIAL_USERS[2],
    content: 'ສຽງຂໍ້ຄວາມ (0:08)',
    type: 'voice',
    mediaUrl: 'sample_audio',
    duration: 8,
    isRead: true,
    isDelivered: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_me',
    type: 'friend_request',
    title: 'ຄຳຂໍເປັນເພື່ອນໃໝ່',
    body: 'Souphaphone Keomany ໄດ້ສົ່ງຄຳຂໍເປັນເພື່ອນຫາເຈົ້າ',
    sender: INITIAL_USERS[3],
    isRead: false,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'user_me',
    type: 'post_like',
    title: 'ຖືກໃຈໂພສ',
    body: 'Khamla Phommachan ຖືກໃຈໂພສຂອງເຈົ້າ',
    sender: INITIAL_USERS[2],
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'freq_1',
    senderId: 'user_3',
    receiverId: 'user_me',
    sender: INITIAL_USERS[3],
    receiver: INITIAL_USERS[0],
    status: 'pending',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  }
];

const INITIAL_FRIENDSHIPS = [
  { user1Id: 'user_me', user2Id: 'user_1', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { user1Id: 'user_me', user2Id: 'user_2', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    targetType: 'post',
    targetId: 'post_3',
    reporterId: 'user_1',
    reporter: INITIAL_USERS[1],
    reason: 'Spam or irrelevant content',
    details: 'Looking for gamers on wrong channel',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit_1',
    adminId: 'user_me',
    adminName: 'Khampheng (You)',
    action: 'SYSTEM_STARTUP',
    targetType: 'SYSTEM',
    targetId: 'gukgic_v1',
    details: 'System initialized and database configured.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
];

class MemoryDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [...INITIAL_USERS],
      passwords: {
        khampheng: 'password123',
        alouny_s: 'password123',
        khamla_dev: 'password123',
        soupha_k: 'password123',
        sengchanh_camp: 'password123',
        vila_gamer: 'password123',
      },
      friendships: [...INITIAL_FRIENDSHIPS],
      friendRequests: [...INITIAL_FRIEND_REQUESTS],
      posts: [...INITIAL_POSTS],
      comments: [...INITIAL_COMMENTS],
      conversations: [...INITIAL_CONVERSATIONS],
      messages: [...INITIAL_MESSAGES],
      notifications: [...INITIAL_NOTIFICATIONS],
      reports: [...INITIAL_REPORTS],
      blocks: [],
      ads: [...INITIAL_ADS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
    };
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.users && parsed.posts) {
          this.data = { ...this.data, ...parsed };
        }
      }
    } catch {
      // Ignore fallback errors and use in-memory
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch {
      // Ignore disk write errors in ephemeral environments
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(user: User, passwordHash: string): User {
    this.data.users.push(user);
    this.data.passwords[user.username] = passwordHash;
    this.saveToDisk();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveToDisk();
    return this.data.users[idx];
  }

  // --- Friendship System ---
  getFriendshipStatus(currentUserId: string, targetUserId: string): FriendshipStatus {
    if (currentUserId === targetUserId) return 'none';

    // Check block
    const isBlocked = this.data.blocks.some(
      (b) =>
        (b.blockerId === currentUserId && b.blockedId === targetUserId) ||
        (b.blockerId === targetUserId && b.blockedId === currentUserId)
    );
    if (isBlocked) return 'blocked';

    // Check friends
    const areFriends = this.data.friendships.some(
      (f) =>
        (f.user1Id === currentUserId && f.user2Id === targetUserId) ||
        (f.user1Id === targetUserId && f.user2Id === currentUserId)
    );
    if (areFriends) return 'friends';

    // Check outgoing pending request
    const outgoing = this.data.friendRequests.find(
      (r) => r.senderId === currentUserId && r.receiverId === targetUserId && r.status === 'pending'
    );
    if (outgoing) return 'pending';

    // Check incoming pending request
    const incoming = this.data.friendRequests.find(
      (r) => r.senderId === targetUserId && r.receiverId === currentUserId && r.status === 'pending'
    );
    if (incoming) return 'incoming';

    return 'none';
  }

  getFriends(userId: string): User[] {
    const friendIds = this.data.friendships
      .filter((f) => f.user1Id === userId || f.user2Id === userId)
      .map((f) => (f.user1Id === userId ? f.user2Id : f.user1Id));

    return this.data.users.filter((u) => friendIds.includes(u.id));
  }

  getPendingRequests(userId: string): FriendRequest[] {
    return this.data.friendRequests.filter(
      (r) => r.receiverId === userId && r.status === 'pending'
    );
  }

  getSentRequests(userId: string): FriendRequest[] {
    return this.data.friendRequests.filter(
      (r) => r.senderId === userId && r.status === 'pending'
    );
  }

  sendFriendRequest(senderId: string, receiverId: string): FriendRequest | null {
    const sender = this.getUserById(senderId);
    const receiver = this.getUserById(receiverId);
    if (!sender || !receiver) return null;

    const existing = this.data.friendRequests.find(
      (r) => r.senderId === senderId && r.receiverId === receiverId && r.status === 'pending'
    );
    if (existing) return existing;

    const request: FriendRequest = {
      id: `req_${Date.now()}`,
      senderId,
      receiverId,
      sender,
      receiver,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.data.friendRequests.push(request);

    this.createNotification({
      userId: receiverId,
      type: 'friend_request',
      title: 'ຄຳຂໍເປັນເພື່ອນໃໝ່',
      body: `${sender.name} ໄດ້ສົ່ງຄຳຂໍເປັນເພື່ອນຫາເຈົ້າ`,
      sender,
    });

    this.saveToDisk();
    return request;
  }

  acceptFriendRequest(requestId: string, userId: string): boolean {
    const request = this.data.friendRequests.find((r) => r.id === requestId);
    if (!request || request.receiverId !== userId) return false;

    request.status = 'accepted';

    this.data.friendships.push({
      user1Id: request.senderId,
      user2Id: request.receiverId,
      createdAt: new Date().toISOString(),
    });

    const u1 = this.getUserById(request.senderId);
    const u2 = this.getUserById(request.receiverId);
    if (u1) u1.friendsCount += 1;
    if (u2) u2.friendsCount += 1;

    if (u2) {
      this.createNotification({
        userId: request.senderId,
        type: 'friend_accept',
        title: 'ຍອມຮັບຄຳຂໍເປັນເພື່ອນ',
        body: `${u2.name} ໄດ້ຕອບຮັບຄຳຂໍເປັນເພື່ອນຂອງເຈົ້າແລ້ວ!`,
        sender: u2,
      });
    }

    this.saveToDisk();
    return true;
  }

  rejectFriendRequest(requestId: string, userId: string): boolean {
    const request = this.data.friendRequests.find((r) => r.id === requestId);
    if (!request || request.receiverId !== userId) return false;
    request.status = 'rejected';
    this.saveToDisk();
    return true;
  }

  cancelFriendRequest(senderId: string, receiverId: string): boolean {
    const idx = this.data.friendRequests.findIndex(
      (r) => r.senderId === senderId && r.receiverId === receiverId && r.status === 'pending'
    );
    if (idx !== -1) {
      this.data.friendRequests.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  removeFriend(userId1: string, userId2: string): boolean {
    const idx = this.data.friendships.findIndex(
      (f) =>
        (f.user1Id === userId1 && f.user2Id === userId2) ||
        (f.user1Id === userId2 && f.user2Id === userId1)
    );
    if (idx !== -1) {
      this.data.friendships.splice(idx, 1);
      const u1 = this.getUserById(userId1);
      const u2 = this.getUserById(userId2);
      if (u1 && u1.friendsCount > 0) u1.friendsCount -= 1;
      if (u2 && u2.friendsCount > 0) u2.friendsCount -= 1;
      this.saveToDisk();
      return true;
    }
    return false;
  }

  getBlockedUsers(userId: string): User[] {
    const blockedIds = this.data.blocks
      .filter((b) => b.blockerId === userId)
      .map((b) => b.blockedId);
    return this.data.users.filter((u) => blockedIds.includes(u.id));
  }

  // --- Friend Discovery ---
  discoverFriends(currentUserId: string, options?: { city?: string; interest?: string; search?: string }): User[] {
    const friends = this.getFriends(currentUserId).map((f) => f.id);
    const blockedIds = this.data.blocks
      .filter((b) => b.blockerId === currentUserId || b.blockedId === currentUserId)
      .map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId));

    let list = this.data.users.filter(
      (u) => u.id !== currentUserId && !friends.includes(u.id) && !blockedIds.includes(u.id)
    );

    if (options?.city && options.city !== 'All') {
      list = list.filter((u) => u.city?.toLowerCase() === options.city?.toLowerCase() || u.location?.toLowerCase().includes(options.city?.toLowerCase() || ''));
    }

    if (options?.interest && options.interest !== 'All') {
      list = list.filter((u) => u.interests.some((i) => i.toLowerCase() === options.interest?.toLowerCase()));
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.bio?.toLowerCase().includes(q) ||
          u.interests.some((i) => i.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // --- Posts ---
  getPosts(currentUserId?: string): Post[] {
    return this.data.posts
      .filter((p) => !p.isHidden)
      .map((p) => {
        const author = this.getUserById(p.userId) || p.author;
        return {
          ...p,
          author,
          isLiked: p.isLiked || false,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPost(userId: string, content: string, mediaUrl?: string): Post | null {
    const author = this.getUserById(userId);
    if (!author) return null;

    const post: Post = {
      id: `post_${Date.now()}`,
      userId,
      author,
      content,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    this.data.posts.unshift(post);
    author.postsCount += 1;
    this.saveToDisk();
    return post;
  }

  toggleLikePost(postId: string, userId: string): { isLiked: boolean; likesCount: number } | null {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) return null;

    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

    if (post.isLiked && post.userId !== userId) {
      const sender = this.getUserById(userId);
      if (sender) {
        this.createNotification({
          userId: post.userId,
          type: 'post_like',
          title: 'ຖືກໃຈໂພສ',
          body: `${sender.name} ຖືກໃຈໂພສຂອງເຈົ້າ`,
          sender,
          targetId: postId,
        });
      }
    }

    this.saveToDisk();
    return { isLiked: post.isLiked, likesCount: post.likesCount };
  }

  getComments(postId: string): PostComment[] {
    return this.data.comments
      .filter((c) => c.postId === postId && !c.isHidden)
      .map((c) => ({
        ...c,
        author: this.getUserById(c.userId) || c.author,
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addComment(postId: string, userId: string, content: string): PostComment | null {
    const author = this.getUserById(userId);
    const post = this.data.posts.find((p) => p.id === postId);
    if (!author || !post) return null;

    const comment: PostComment = {
      id: `comm_${Date.now()}`,
      postId,
      userId,
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    this.data.comments.push(comment);
    post.commentsCount += 1;

    if (post.userId !== userId) {
      this.createNotification({
        userId: post.userId,
        type: 'post_comment',
        title: 'ຄວາມຄິດເຫັນໃໝ່',
        body: `${author.name} ໄດ້ສະແດງຄວາມຄິດເຫັນເທິງໂພສຂອງເຈົ້າ: "${content.slice(0, 30)}..."`,
        sender: author,
        targetId: postId,
      });
    }

    this.saveToDisk();
    return comment;
  }

  // --- Conversations & Messages ---
  getConversations(userId: string): Conversation[] {
    return this.data.conversations
      .filter((c) => c.participants.some((p) => p.id === userId))
      .map((c) => ({
        ...c,
        participants: c.participants.map((p) => this.getUserById(p.id) || p),
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getOrCreateConversation(user1Id: string, user2Id: string): Conversation {
    const existing = this.data.conversations.find(
      (c) =>
        c.participants.some((p) => p.id === user1Id) &&
        c.participants.some((p) => p.id === user2Id)
    );

    if (existing) {
      return {
        ...existing,
        participants: existing.participants.map((p) => this.getUserById(p.id) || p),
      };
    }

    const u1 = this.getUserById(user1Id);
    const u2 = this.getUserById(user2Id);
    if (!u1 || !u2) throw new Error('Users not found');

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participants: [u1, u2],
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };

    this.data.conversations.unshift(newConv);
    this.saveToDisk();
    return newConv;
  }

  getMessages(conversationId: string): Message[] {
    return this.data.messages
      .filter((m) => m.conversationId === conversationId)
      .map((m) => ({
        ...m,
        sender: this.getUserById(m.senderId) || m.sender,
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  createMessage(params: {
    conversationId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
    duration?: number;
    replyTo?: { id: string; senderName: string; content: string };
  }): Message | null {
    const sender = this.getUserById(params.senderId);
    const conv = this.data.conversations.find((c) => c.id === params.conversationId);
    if (!sender || !conv) return null;

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: params.conversationId,
      senderId: params.senderId,
      sender,
      content: params.content,
      type: params.type || 'text',
      mediaUrl: params.mediaUrl,
      duration: params.duration,
      replyTo: params.replyTo,
      isRead: false,
      isDelivered: true,
      createdAt: new Date().toISOString(),
    };

    this.data.messages.push(message);
    conv.lastMessage = message;
    conv.updatedAt = message.createdAt;

    this.saveToDisk();
    return message;
  }

  deleteMessage(messageId: string, userId: string): boolean {
    const idx = this.data.messages.findIndex((m) => m.id === messageId && m.senderId === userId);
    if (idx !== -1) {
      this.data.messages.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Notifications ---
  getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications
      .filter((n) => n.userId === userId)
      .map((n) => ({
        ...n,
        sender: n.sender ? this.getUserById(n.sender.id) || n.sender : undefined,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(params: {
    userId: string;
    type: 'friend_request' | 'friend_accept' | 'post_like' | 'post_comment' | 'message' | 'system';
    title: string;
    body: string;
    sender?: User;
    targetId?: string;
  }): NotificationItem {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      sender: params.sender,
      targetId: params.targetId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    this.data.notifications.unshift(notif);
    this.saveToDisk();
    return notif;
  }

  markAllNotificationsRead(userId: string): void {
    this.data.notifications
      .filter((n) => n.userId === userId)
      .forEach((n) => {
        n.isRead = true;
      });
    this.saveToDisk();
  }

  // --- Ads ---
  getAds(): Advertisement[] {
    return this.data.ads.filter((a) => a.isActive);
  }

  getAllAds(): Advertisement[] {
    return this.data.ads;
  }

  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>): Advertisement {
    const newAd: Advertisement = {
      id: `ad_${Date.now()}`,
      ...ad,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.ads.unshift(newAd);
    this.saveToDisk();
    return newAd;
  }

  updateAd(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const idx = this.data.ads.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.ads[idx] = { ...this.data.ads[idx], ...updates };
    this.saveToDisk();
    return this.data.ads[idx];
  }

  deleteAd(id: string): boolean {
    const idx = this.data.ads.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.ads.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Moderation & Reports ---
  getReports(): ReportItem[] {
    return this.data.reports.map((r) => ({
      ...r,
      reporter: this.getUserById(r.reporterId) || r.reporter,
    }));
  }

  report(item: { targetType: 'user' | 'post' | 'comment' | 'message'; targetId: string; reporterId: string; reason: string; details?: string }): ReportItem {
    const rep: ReportItem = {
      id: `rep_${Date.now()}`,
      ...item,
      status: 'pending',
      actionTaken: 'none',
      createdAt: new Date().toISOString(),
    };
    this.data.reports.unshift(rep);
    this.saveToDisk();
    return rep;
  }

  resolveReport(reportId: string, action: ReportItem['actionTaken'], adminUser: User): boolean {
    const report = this.data.reports.find((r) => r.id === reportId);
    if (!report) return false;

    report.status = 'resolved';
    report.actionTaken = action;
    report.resolvedBy = adminUser.name;
    report.resolvedAt = new Date().toISOString();

    // Execute action
    if (action === 'hidden' || action === 'removed') {
      if (report.targetType === 'post') {
        const p = this.data.posts.find((post) => post.id === report.targetId);
        if (p) p.isHidden = true;
      } else if (report.targetType === 'comment') {
        const c = this.data.comments.find((comm) => comm.id === report.targetId);
        if (c) c.isHidden = true;
      }
    } else if (action === 'banned') {
      if (report.targetType === 'user') {
        const u = this.getUserById(report.targetId);
        if (u) u.isBanned = true;
      }
    }

    // Add audit log
    this.addAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: `RESOLVE_REPORT_${action?.toUpperCase()}`,
      targetType: report.targetType,
      targetId: report.targetId,
      details: `Report ${reportId} resolved with action ${action}. Reason: ${report.reason}`,
    });

    this.saveToDisk();
    return true;
  }

  dismissReport(reportId: string, adminUser: User): boolean {
    const report = this.data.reports.find((r) => r.id === reportId);
    if (!report) return false;

    report.status = 'dismissed';
    report.resolvedBy = adminUser.name;
    report.resolvedAt = new Date().toISOString();

    this.addAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name,
      action: 'DISMISS_REPORT',
      targetType: report.targetType,
      targetId: report.targetId,
      details: `Report ${reportId} dismissed as not violating guidelines.`,
    });

    this.saveToDisk();
    return true;
  }

  blockUser(blockerId: string, blockedId: string): void {
    if (!this.data.blocks.some((b) => b.blockerId === blockerId && b.blockedId === blockedId)) {
      this.data.blocks.push({
        blockerId,
        blockedId,
        createdAt: new Date().toISOString(),
      });
      this.removeFriend(blockerId, blockedId);
      this.saveToDisk();
    }
  }

  unblockUser(blockerId: string, blockedId: string): void {
    const idx = this.data.blocks.findIndex((b) => b.blockerId === blockerId && b.blockedId === blockedId);
    if (idx !== -1) {
      this.data.blocks.splice(idx, 1);
      this.saveToDisk();
    }
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLogItem[] {
    return this.data.auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addAuditLog(log: Omit<AuditLogItem, 'id' | 'createdAt'>): AuditLogItem {
    const newLog: AuditLogItem = {
      id: `audit_${Date.now()}`,
      ...log,
      createdAt: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(newLog);
    this.saveToDisk();
    return newLog;
  }

  // --- Admin Overview Stats ---
  getAdminStats() {
    return {
      totalUsers: this.data.users.length,
      activeUsers: this.data.users.filter((u) => u.isOnline).length,
      totalPosts: this.data.posts.length,
      pendingReports: this.data.reports.filter((r) => r.status === 'pending').length,
      totalAds: this.data.ads.length,
      activeAds: this.data.ads.filter((a) => a.isActive).length,
      totalConversations: this.data.conversations.length,
    };
  }
}

const globalForDb = global as unknown as { dbInstance?: MemoryDB };
export const db = globalForDb.dbInstance ?? new MemoryDB();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
