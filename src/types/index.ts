export type LanguageCode = 'lo' | 'en' | 'th' | 'zh' | 'vi';
export type ThemeMode = 'light' | 'dark' | 'system';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserSettings {
  profileVisibility: 'public' | 'friends' | 'private';
  postVisibility: 'public' | 'friends' | 'private';
  whoCanSendRequests: 'everyone' | 'friends_of_friends' | 'none';
  pushNotifications: boolean;
  messageNotifications: boolean;
  socialNotifications: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  city?: string;
  languages: string[];
  interests: string[];
  friendsCount: number;
  postsCount: number;
  isOnline: boolean;
  lastSeen?: string;
  role: UserRole;
  isBanned?: boolean;
  isSuspended?: boolean;
  settings?: UserSettings;
  createdAt: string;
  updatedAt?: string;
  mutualFriendsCount?: number;
}

export type FriendshipStatus = 'none' | 'pending' | 'incoming' | 'friends' | 'blocked';

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isHidden?: boolean;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  content: string;
  isHidden?: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'voice' | 'image';
  mediaUrl?: string;
  duration?: number; // for voice in seconds
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'friend_request' | 'friend_accept' | 'post_like' | 'post_comment' | 'message' | 'system';
  title: string;
  body: string;
  sender?: User;
  targetId?: string; // post ID or conversation ID
  isRead: boolean;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  targetUrl: string;
  badge?: string;
  isActive: boolean;
  impressions?: number;
  clicks?: number;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetType: 'user' | 'post' | 'comment' | 'message';
  targetId: string;
  reporterId: string;
  reporter?: User;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  actionTaken?: 'none' | 'hidden' | 'removed' | 'warned' | 'suspended' | 'banned';
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}
