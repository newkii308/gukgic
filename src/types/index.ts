export type LanguageCode = 'lo' | 'en' | 'th' | 'zh' | 'vi';
export type ThemeMode = 'light' | 'dark' | 'system';

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
  createdAt: string;
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
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  content: string;
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
}

export interface ReportItem {
  id: string;
  targetType: 'user' | 'post' | 'message';
  targetId: string;
  reporterId: string;
  reason: string;
  details?: string;
  createdAt: string;
}
