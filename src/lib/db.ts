import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
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
  UserRole
} from '@/types';

export interface DatabaseRecord {
  users: (User & { passwordHash: string })[];
  friendships: { id: string; user1Id: string; user2Id: string; createdAt: string }[];
  friendRequests: FriendRequest[];
  blocks: { id: string; blockerId: string; blockedId: string; createdAt: string }[];
  posts: Post[];
  postLikes: { id: string; postId: string; userId: string; createdAt: string }[];
  postComments: PostComment[];
  conversations: { id: string; createdAt: string; updatedAt: string }[];
  conversationMembers: { id: string; conversationId: string; userId: string; createdAt: string }[];
  messages: Message[];
  notifications: NotificationItem[];
  advertisements: Advertisement[];
  reports: ReportItem[];
  auditLogs: AuditLogItem[];
}

const DB_FILE_PATH = path.join(process.cwd(), '.data', 'gukgic_database.json');

const DEFAULT_SETTINGS: UserSettings = {
  profileVisibility: 'public',
  postVisibility: 'public',
  whoCanSendRequests: 'everyone',
  pushNotifications: true,
  messageNotifications: true,
  socialNotifications: true,
};

// Seed password hash for standard seed users: bcrypt hash of "password123"
const SEED_PASSWORD_HASH = '$2a$10$wB5p6uV8G7J6r1QyL2Xzfe8gC9kZp.M7uT5aN4v8Y1W2e3R4t5Y6u'; // password123

const SEED_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user_khampheng',
    username: 'khampheng',
    name: 'Khampheng Dev',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສະບາຍດີ! ມັກຊອກຫາເພື່ອນໃໝ່ ຖ່າຍຮູບ ແລະ ຮ້ານກາເຟງາມໆໃນວຽງຈັນ ☕🇱🇦',
    location: 'Vientiane Capital',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Photography', 'Coffee', 'Music', 'Tech', 'Travel'],
    friendsCount: 2,
    postsCount: 2,
    isOnline: true,
    role: 'admin',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user_alouny',
    username: 'alouny_s',
    name: 'Alouny Souvannavong',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສະບາຍດີທຸກຄົນ! ມັກຖ່າຍຮູບຟິມ & ຊອກຫາຮ້ານກາເຟໃໝ່ໆ 📸✨',
    location: 'Vientiane, Laos',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Photography', 'Cafe hopping', 'Indie Music', 'Art'],
    friendsCount: 1,
    postsCount: 1,
    isOnline: true,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user_khamla',
    username: 'khamla_dev',
    name: 'Khamla Phommachan',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    bio: 'Junior Frontend Dev ຢູ່ຫຼວງພະບາງ ມັກປັ່ນລົດຖີບຍາມແລງ 🚴‍♂️💻☕',
    location: 'Luang Prabang',
    city: 'Luang Prabang',
    languages: ['ລາວ', 'English', '中文'],
    interests: ['Coding', 'Cycling', 'Tech', 'Gaming', 'Coffee'],
    friendsCount: 1,
    postsCount: 1,
    isOnline: true,
    role: 'moderator',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user_soupha',
    username: 'soupha_k',
    name: 'Souphaphone Keomany',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    bio: 'Gen Z Vientiane, ມັກແຕ່ງໂຕ & ຟັງເພງ K-Pop 🎧 ໃຜມັກເຕັ້ນທັກມາລົມກັນໄດ້!',
    location: 'Vientiane',
    city: 'Vientiane',
    languages: ['ລາວ', 'English', '한국어'],
    interests: ['Fashion', 'K-Pop', 'Dance', 'Cafe hopping', 'Travel'],
    friendsCount: 0,
    postsCount: 0,
    isOnline: false,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user_sengchanh',
    username: 'sengchanh_camp',
    name: 'Sengchanh Inthavong',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    bio: 'ສາຍແຄັມປິ້ງປາກເຊ ໃຜມັກທ່ຽວທຳມະຊາດ & ດີດກີຕ້າ ທັກມາໄດ້ເດີ້ ⛺🌲🎸',
    location: 'Pakse, Champasak',
    city: 'Champasak',
    languages: ['ລາວ', 'English', 'Tiếng Việt'],
    interests: ['Camping', 'Hiking', 'Acoustic Guitar', 'Nature', 'Photography'],
    friendsCount: 0,
    postsCount: 0,
    isOnline: false,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user_vila',
    username: 'vila_gamer',
    name: 'Vilaphone Saysana',
    passwordHash: SEED_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    bio: 'ຫາໝູ່ຕີເກມ Valorant & ເຂົ້າຢິມ 💪🎮 ມັກລົມເລື່ອງອານິເມະ',
    location: 'Savannakhet',
    city: 'Savannakhet',
    languages: ['ລາວ', 'English', 'ไทย'],
    interests: ['Gaming', 'Anime', 'Valorant', 'Fitness', 'Movies'],
    friendsCount: 0,
    postsCount: 1,
    isOnline: true,
    role: 'user',
    settings: { ...DEFAULT_SETTINGS },
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const SEED_ADS: Advertisement[] = [
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

const SEED_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_alouny',
    author: SEED_USERS[1],
    content: 'ມື້ນີ້ມານັ່ງເຮັດວຽກຢູ່ຮ້ານກາເຟແຖວຮິມຂອງ ບັນຍາກາດດີຫຼາຍລົມເຢັນສະບາຍ ໃຜຢູ່ແຖວນີ້ຢາກມານັ່ງລົມກັນທັກມາໄດ້ເດີ້! ☕🌅',
    mediaUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 1,
    commentsCount: 2,
    sharesCount: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_2',
    userId: 'user_khamla',
    author: SEED_USERS[2],
    content: 'ປັ່ນລົດຖີບຂຶ້ນພູສີຍາມແລງ ຫຼວງພະບາງງາມສະເໝີເລີຍ ມີໃຜມັກປັ່ນລົດຖີບທ່ຽວຄືກັນແດ່? 🚴‍♀️✨',
    mediaUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    likesCount: 1,
    commentsCount: 1,
    sharesCount: 0,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_3',
    userId: 'user_vila',
    author: SEED_USERS[5],
    content: 'ຫາໝູ່ຕີ Valorant ແລງນີ້ 5 ຄົນ Rank Gold-Plat ໃຜວ່າງແດ່ທັກ Discord ມາໄດ້ເລີຍ! 🎮🔥',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  }
];

class RelationalDatabaseEngine {
  private data: DatabaseRecord;

  constructor() {
    this.data = {
      users: [...SEED_USERS],
      friendships: [
        { id: 'f_1', user1Id: 'user_khampheng', user2Id: 'user_alouny', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'f_2', user1Id: 'user_khampheng', user2Id: 'user_khamla', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      ],
      friendRequests: [
        {
          id: 'freq_1',
          senderId: 'user_soupha',
          receiverId: 'user_khampheng',
          sender: SEED_USERS[3],
          receiver: SEED_USERS[0],
          status: 'pending',
          createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        }
      ],
      blocks: [],
      posts: [...SEED_POSTS],
      postLikes: [
        { id: 'like_1', postId: 'post_1', userId: 'user_khampheng', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { id: 'like_2', postId: 'post_2', userId: 'user_khampheng', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      ],
      postComments: [
        {
          id: 'comm_1',
          postId: 'post_1',
          userId: 'user_soupha',
          author: SEED_USERS[3],
          content: 'ຮ້ານໃດນໍ້ນ້ອງອາລຸນີ? ບັນຍາກາດຄືເປັນຕາໄປແທ້ 😍',
          createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        },
        {
          id: 'comm_2',
          postId: 'post_1',
          userId: 'user_alouny',
          author: SEED_USERS[1],
          content: '@soupha_k ຮ້ານແຖວສວນເຈົ້າອະນຸວົງເຈົ້າ ເອື້ອຍມາເລີຍ!',
          createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        },
        {
          id: 'comm_3',
          postId: 'post_2',
          userId: 'user_sengchanh',
          author: SEED_USERS[4],
          content: 'ຫຼວງພະບາງຍາມນີ້ໜ້າໄປທ່ຽວແທ້ໆ 🚴‍♂️',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        }
      ],
      conversations: [
        { id: 'conv_1', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { id: 'conv_2', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      ],
      conversationMembers: [
        { id: 'cm_1', conversationId: 'conv_1', userId: 'user_khampheng', createdAt: new Date().toISOString() },
        { id: 'cm_2', conversationId: 'conv_1', userId: 'user_alouny', createdAt: new Date().toISOString() },
        { id: 'cm_3', conversationId: 'conv_2', userId: 'user_khampheng', createdAt: new Date().toISOString() },
        { id: 'cm_4', conversationId: 'conv_2', userId: 'user_khamla', createdAt: new Date().toISOString() },
      ],
      messages: [
        {
          id: 'msg_1',
          conversationId: 'conv_1',
          senderId: 'user_khampheng',
          sender: SEED_USERS[0],
          content: 'ສະບາຍດີອາລຸນີ! ເຫັນໂພສຮູບກາເຟງາມຫຼາຍ ຢູ່ຮ້ານໃດຫວາ?',
          type: 'text',
          isRead: true,
          isDelivered: true,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: 'msg_2',
          conversationId: 'conv_1',
          senderId: 'user_alouny',
          sender: SEED_USERS[1],
          content: 'ສະບາຍດີຄຳແພງ! ຢູ່ຮ້ານແຖວຮິມຂອງເດີ້ ກາເຟແຊບຫຼາຍ',
          type: 'text',
          isRead: true,
          isDelivered: true,
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        },
        {
          id: 'msg_3',
          conversationId: 'conv_1',
          senderId: 'user_alouny',
          sender: SEED_USERS[1],
          content: 'ມື້ອື່ນເຈົ້າວ່າງບໍ່? ໄປຮ້ານກາເຟນຳກັນ!',
          type: 'text',
          isRead: false,
          isDelivered: true,
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
        {
          id: 'msg_voice_1',
          conversationId: 'conv_2',
          senderId: 'user_khamla',
          sender: SEED_USERS[2],
          content: 'ສຽງຂໍ້ຄວາມ (0:08)',
          type: 'voice',
          duration: 8,
          isRead: true,
          isDelivered: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        }
      ],
      notifications: [
        {
          id: 'notif_1',
          userId: 'user_khampheng',
          type: 'friend_request',
          title: 'ຄຳຂໍເປັນເພື່ອນໃໝ່',
          body: 'Souphaphone Keomany ໄດ້ສົ່ງຄຳຂໍເປັນເພື່ອນຫາເຈົ້າ',
          sender: SEED_USERS[3],
          isRead: false,
          createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        },
        {
          id: 'notif_2',
          userId: 'user_khampheng',
          type: 'post_like',
          title: 'ຖືກໃຈໂພສ',
          body: 'Khamla Phommachan ຖືກໃຈໂພສຂອງເຈົ້າ',
          sender: SEED_USERS[2],
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        }
      ],
      advertisements: [...SEED_ADS],
      reports: [],
      auditLogs: [],
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
      //
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
      //
    }
  }

  // --- Users & Auth ---
  getUsers(): User[] {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  getUserById(id: string): User | undefined {
    const userWithHash = this.data.users.find((u) => u.id === id);
    if (!userWithHash) return undefined;
    const { passwordHash, ...user } = userWithHash;
    return user;
  }

  getUserWithPassword(username: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());
  }

  getUserByUsername(username: string): User | undefined {
    const userWithHash = this.data.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim()
    );
    if (!userWithHash) return undefined;
    const { passwordHash, ...user } = userWithHash;
    return user;
  }

  createUser(user: User, passwordHash: string): User {
    const existing = this.data.users.find(
      (u) => u.username.toLowerCase() === user.username.toLowerCase().trim()
    );
    if (existing) throw new Error('Username already exists');

    const newUserWithHash = { ...user, passwordHash };
    this.data.users.push(newUserWithHash);
    this.saveToDisk();

    const { passwordHash: _, ...createdUser } = newUserWithHash;
    return createdUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString() as any,
    };
    this.saveToDisk();

    const { passwordHash, ...user } = this.data.users[idx];
    return user;
  }

  // --- Friend System ---
  getFriendshipStatus(currentUserId: string, targetUserId: string): FriendshipStatus {
    if (currentUserId === targetUserId) return 'none';

    // Check block
    const isBlocked = this.data.blocks.some(
      (b) =>
        (b.blockerId === currentUserId && b.blockedId === targetUserId) ||
        (b.blockerId === targetUserId && b.blockedId === currentUserId)
    );
    if (isBlocked) return 'blocked';

    // Check friendship
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

    return this.data.users
      .filter((u) => friendIds.includes(u.id) && !u.isBanned)
      .map(({ passwordHash, ...user }) => user);
  }

  getPendingRequests(userId: string): FriendRequest[] {
    return this.data.friendRequests
      .filter((r) => r.receiverId === userId && r.status === 'pending')
      .map((r) => ({
        ...r,
        sender: this.getUserById(r.senderId) || r.sender,
        receiver: this.getUserById(r.receiverId) || r.receiver,
      }));
  }

  getSentRequests(userId: string): FriendRequest[] {
    return this.data.friendRequests
      .filter((r) => r.senderId === userId && r.status === 'pending')
      .map((r) => ({
        ...r,
        sender: this.getUserById(r.senderId) || r.sender,
        receiver: this.getUserById(r.receiverId) || r.receiver,
      }));
  }

  sendFriendRequest(senderId: string, receiverId: string): FriendRequest {
    if (senderId === receiverId) throw new Error('Cannot send friend request to yourself');

    const status = this.getFriendshipStatus(senderId, receiverId);
    if (status === 'blocked') throw new Error('Cannot send friend request to blocked user');
    if (status === 'friends') throw new Error('Already friends');
    if (status === 'pending') throw new Error('Friend request already sent');

    const sender = this.getUserById(senderId);
    const receiver = this.getUserById(receiverId);
    if (!sender || !receiver) throw new Error('User not found');

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

  acceptFriendRequest(requestId: string, currentUserId: string): boolean {
    const request = this.data.friendRequests.find((r) => r.id === requestId);
    if (!request || request.receiverId !== currentUserId || request.status !== 'pending') {
      return false;
    }

    request.status = 'accepted';

    // Add unique friendship
    const alreadyFriends = this.data.friendships.some(
      (f) =>
        (f.user1Id === request.senderId && f.user2Id === request.receiverId) ||
        (f.user1Id === request.receiverId && f.user2Id === request.senderId)
    );

    if (!alreadyFriends) {
      this.data.friendships.push({
        id: `f_${Date.now()}`,
        user1Id: request.senderId,
        user2Id: request.receiverId,
        createdAt: new Date().toISOString(),
      });

      const u1 = this.getUserById(request.senderId);
      const u2 = this.getUserById(request.receiverId);
      if (u1) this.updateUser(u1.id, { friendsCount: u1.friendsCount + 1 });
      if (u2) this.updateUser(u2.id, { friendsCount: u2.friendsCount + 1 });

      if (u2) {
        this.createNotification({
          userId: request.senderId,
          type: 'friend_accept',
          title: 'ຍອມຮັບຄຳຂໍເປັນເພື່ອນ',
          body: `${u2.name} ໄດ້ຕອບຮັບຄຳຂໍເປັນເພື່ອນຂອງເຈົ້າແລ້ວ!`,
          sender: u2,
        });
      }
    }

    this.saveToDisk();
    return true;
  }

  rejectFriendRequest(requestId: string, currentUserId: string): boolean {
    const request = this.data.friendRequests.find((r) => r.id === requestId);
    if (!request || request.receiverId !== currentUserId) return false;
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
      if (u1 && u1.friendsCount > 0) this.updateUser(u1.id, { friendsCount: u1.friendsCount - 1 });
      if (u2 && u2.friendsCount > 0) this.updateUser(u2.id, { friendsCount: u2.friendsCount - 1 });
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Block System ---
  blockUser(blockerId: string, blockedId: string): void {
    if (blockerId === blockedId) return;

    if (!this.data.blocks.some((b) => b.blockerId === blockerId && b.blockedId === blockedId)) {
      this.data.blocks.push({
        id: `blk_${Date.now()}`,
        blockerId,
        blockedId,
        createdAt: new Date().toISOString(),
      });
      // Remove any friendship or pending requests
      this.removeFriend(blockerId, blockedId);
      this.data.friendRequests = this.data.friendRequests.filter(
        (r) =>
          !(r.senderId === blockerId && r.receiverId === blockedId) &&
          !(r.senderId === blockedId && r.receiverId === blockerId)
      );
      this.saveToDisk();
    }
  }

  unblockUser(blockerId: string, blockedId: string): void {
    this.data.blocks = this.data.blocks.filter(
      (b) => !(b.blockerId === blockerId && b.blockedId === blockedId)
    );
    this.saveToDisk();
  }

  getBlockedUsers(userId: string): User[] {
    const blockedIds = this.data.blocks
      .filter((b) => b.blockerId === userId)
      .map((b) => b.blockedId);
    return this.data.users
      .filter((u) => blockedIds.includes(u.id))
      .map(({ passwordHash, ...user }) => user);
  }

  // --- Discovery ---
  discoverFriends(currentUserId: string, options?: { city?: string; interest?: string; search?: string }): User[] {
    const friends = this.getFriends(currentUserId).map((f) => f.id);
    const blockedIds = this.data.blocks
      .filter((b) => b.blockerId === currentUserId || b.blockedId === currentUserId)
      .map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId));

    let list = this.data.users
      .filter((u) => u.id !== currentUserId && !friends.includes(u.id) && !blockedIds.includes(u.id) && !u.isBanned)
      .map(({ passwordHash, ...user }) => user);

    if (options?.city && options.city !== 'All') {
      list = list.filter(
        (u) =>
          u.city?.toLowerCase() === options.city?.toLowerCase() ||
          u.location?.toLowerCase().includes(options.city?.toLowerCase() || '')
      );
    }

    if (options?.interest && options.interest !== 'All') {
      list = list.filter((u) => u.interests.some((i) => i.toLowerCase() === options.interest?.toLowerCase()));
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
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

  // --- Posts & Feed ---
  getPosts(currentUserId?: string, limit = 20, offset = 0): Post[] {
    const blockedIds = currentUserId
      ? this.data.blocks
          .filter((b) => b.blockerId === currentUserId || b.blockedId === currentUserId)
          .map((b) => (b.blockerId === currentUserId ? b.blockedId : b.blockerId))
      : [];

    return this.data.posts
      .filter((p) => !p.isHidden && !blockedIds.includes(p.userId))
      .map((p) => {
        const author = this.getUserById(p.userId) || p.author;
        const isLiked = currentUserId
          ? this.data.postLikes.some((l) => l.postId === p.id && l.userId === currentUserId)
          : false;
        const likesCount = this.data.postLikes.filter((l) => l.postId === p.id).length;
        const commentsCount = this.data.postComments.filter((c) => c.postId === p.id && !c.isHidden).length;

        return {
          ...p,
          author,
          isLiked,
          likesCount,
          commentsCount,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  createPost(userId: string, content: string, mediaUrl?: string): Post {
    const author = this.getUserById(userId);
    if (!author) throw new Error('Author not found');

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
    this.updateUser(userId, { postsCount: author.postsCount + 1 });
    this.saveToDisk();
    return post;
  }

  deletePost(postId: string, userId: string): boolean {
    const idx = this.data.posts.findIndex((p) => p.id === postId && p.userId === userId);
    if (idx !== -1) {
      this.data.posts.splice(idx, 1);
      // Cascade delete likes and comments
      this.data.postLikes = this.data.postLikes.filter((l) => l.postId !== postId);
      this.data.postComments = this.data.postComments.filter((c) => c.postId !== postId);
      const user = this.getUserById(userId);
      if (user && user.postsCount > 0) this.updateUser(userId, { postsCount: user.postsCount - 1 });
      this.saveToDisk();
      return true;
    }
    return false;
  }

  toggleLikePost(postId: string, userId: string): { isLiked: boolean; likesCount: number } {
    const post = this.data.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const existingIndex = this.data.postLikes.findIndex((l) => l.postId === postId && l.userId === userId);

    let isLiked = false;
    if (existingIndex !== -1) {
      this.data.postLikes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      this.data.postLikes.push({
        id: `like_${Date.now()}`,
        postId,
        userId,
        createdAt: new Date().toISOString(),
      });
      isLiked = true;

      if (post.userId !== userId) {
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
    }

    const likesCount = this.data.postLikes.filter((l) => l.postId === postId).length;
    post.likesCount = likesCount;
    this.saveToDisk();
    return { isLiked, likesCount };
  }

  getComments(postId: string): PostComment[] {
    return this.data.postComments
      .filter((c) => c.postId === postId && !c.isHidden)
      .map((c) => ({
        ...c,
        author: this.getUserById(c.userId) || c.author,
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addComment(postId: string, userId: string, content: string): PostComment {
    const author = this.getUserById(userId);
    const post = this.data.posts.find((p) => p.id === postId);
    if (!author || !post) throw new Error('Post or Author not found');

    const comment: PostComment = {
      id: `comm_${Date.now()}`,
      postId,
      userId,
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    this.data.postComments.push(comment);
    post.commentsCount = this.data.postComments.filter((c) => c.postId === postId && !c.isHidden).length;

    if (post.userId !== userId) {
      this.createNotification({
        userId: post.userId,
        type: 'post_comment',
        title: 'ຄວາມຄິດເຫັນໃໝ່',
        body: `${author.name} ໄດ້ສະແດງຄວາມຄິດເຫັນ: "${content.slice(0, 30)}..."`,
        sender: author,
        targetId: postId,
      });
    }

    this.saveToDisk();
    return comment;
  }

  deleteComment(commentId: string, userId: string): boolean {
    const idx = this.data.postComments.findIndex((c) => c.id === commentId && c.userId === userId);
    if (idx !== -1) {
      const postId = this.data.postComments[idx].postId;
      this.data.postComments.splice(idx, 1);
      const post = this.data.posts.find((p) => p.id === postId);
      if (post) {
        post.commentsCount = this.data.postComments.filter((c) => c.postId === postId && !c.isHidden).length;
      }
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Conversations & Messages ---
  getConversations(userId: string): Conversation[] {
    const userConvs = this.data.conversationMembers
      .filter((cm) => cm.userId === userId)
      .map((cm) => cm.conversationId);

    return this.data.conversations
      .filter((c) => userConvs.includes(c.id))
      .map((c) => {
        const memberIds = this.data.conversationMembers
          .filter((cm) => cm.conversationId === c.id)
          .map((cm) => cm.userId);
        const participants = this.data.users
          .filter((u) => memberIds.includes(u.id))
          .map(({ passwordHash, ...user }) => user);

        const convMessages = this.data.messages.filter((m) => m.conversationId === c.id);
        const lastMessage = convMessages[convMessages.length - 1];
        const unreadCount = convMessages.filter((m) => m.senderId !== userId && !m.isRead).length;

        return {
          id: c.id,
          participants,
          lastMessage,
          unreadCount,
          updatedAt: c.updatedAt,
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getOrCreateConversation(user1Id: string, user2Id: string): Conversation {
    const u1 = this.getUserById(user1Id);
    const u2 = this.getUserById(user2Id);
    if (!u1 || !u2) throw new Error('Users not found');

    // Find conversation where both are members
    const c1 = this.data.conversationMembers.filter((cm) => cm.userId === user1Id).map((cm) => cm.conversationId);
    const c2 = this.data.conversationMembers.filter((cm) => cm.userId === user2Id).map((cm) => cm.conversationId);
    const commonId = c1.find((id) => c2.includes(id));

    if (commonId) {
      const conv = this.data.conversations.find((c) => c.id === commonId);
      if (conv) {
        const memberIds = this.data.conversationMembers.filter((cm) => cm.conversationId === conv.id).map((cm) => cm.userId);
        const participants = this.data.users.filter((u) => memberIds.includes(u.id)).map(({ passwordHash, ...user }) => user);
        return {
          id: conv.id,
          participants,
          unreadCount: 0,
          updatedAt: conv.updatedAt,
        };
      }
    }

    const newId = `conv_${Date.now()}`;
    const now = new Date().toISOString();
    this.data.conversations.unshift({ id: newId, createdAt: now, updatedAt: now });
    this.data.conversationMembers.push(
      { id: `cm_${Date.now()}_1`, conversationId: newId, userId: user1Id, createdAt: now },
      { id: `cm_${Date.now()}_2`, conversationId: newId, userId: user2Id, createdAt: now }
    );
    this.saveToDisk();

    return {
      id: newId,
      participants: [u1, u2],
      unreadCount: 0,
      updatedAt: now,
    };
  }

  getMessages(conversationId: string, userId: string): Message[] {
    // Authorize member
    const isMember = this.data.conversationMembers.some(
      (cm) => cm.conversationId === conversationId && cm.userId === userId
    );
    if (!isMember) throw new Error('Unauthorized to view conversation');

    // Mark incoming messages as read
    this.data.messages
      .filter((m) => m.conversationId === conversationId && m.senderId !== userId && !m.isRead)
      .forEach((m) => {
        m.isRead = true;
      });
    this.saveToDisk();

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
  }): Message {
    const isMember = this.data.conversationMembers.some(
      (cm) => cm.conversationId === params.conversationId && cm.userId === params.senderId
    );
    if (!isMember) throw new Error('Unauthorized');

    const sender = this.getUserById(params.senderId);
    if (!sender) throw new Error('Sender not found');

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

    const conv = this.data.conversations.find((c) => c.id === params.conversationId);
    if (conv) conv.updatedAt = message.createdAt;

    this.saveToDisk();
    return message;
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
    return this.data.advertisements.filter((a) => a.isActive);
  }

  getAllAds(): Advertisement[] {
    return this.data.advertisements;
  }

  createAd(ad: Omit<Advertisement, 'id' | 'createdAt' | 'impressions' | 'clicks'>): Advertisement {
    const newAd: Advertisement = {
      id: `ad_${Date.now()}`,
      ...ad,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.advertisements.unshift(newAd);
    this.saveToDisk();
    return newAd;
  }

  updateAd(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const idx = this.data.advertisements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.advertisements[idx] = { ...this.data.advertisements[idx], ...updates };
    this.saveToDisk();
    return this.data.advertisements[idx];
  }

  deleteAd(id: string): boolean {
    const idx = this.data.advertisements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.advertisements.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- Reports & Moderation ---
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

    if (action === 'hidden' || action === 'removed') {
      if (report.targetType === 'post') {
        const p = this.data.posts.find((post) => post.id === report.targetId);
        if (p) p.isHidden = true;
      }
    } else if (action === 'banned') {
      if (report.targetType === 'user') {
        const u = this.getUserById(report.targetId);
        if (u) this.updateUser(u.id, { isBanned: true });
      }
    }

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

  getAdminStats() {
    return {
      totalUsers: this.data.users.length,
      activeUsers: this.data.users.filter((u) => u.isOnline).length,
      totalPosts: this.data.posts.length,
      pendingReports: this.data.reports.filter((r) => r.status === 'pending').length,
      totalAds: this.data.advertisements.length,
      activeAds: this.data.advertisements.filter((a) => a.isActive).length,
      totalConversations: this.data.conversations.length,
    };
  }
}

const globalForDb = global as unknown as { dbEngineInstance?: RelationalDatabaseEngine };
export const db = globalForDb.dbEngineInstance ?? new RelationalDatabaseEngine();
if (process.env.NODE_ENV !== 'production') globalForDb.dbEngineInstance = db;
