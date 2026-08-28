'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { ProfileHeader } from '@/components/profile/profile-header';
import { PostCard } from '@/components/feed/post-card';
import { FriendCard } from '@/components/friends/friend-card';
import { Post, User } from '@/types';
import { Grid, Users, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'posts' | 'friends' | 'photos'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserData();
  }, [user?.id]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const [postsRes, friendsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/friends'),
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setUserPosts((postsData.posts || []).filter((p: Post) => p.userId === user?.id));
      }

      if (friendsRes.ok) {
        const friendsData = await friendsRes.json();
        setUserFriends(friendsData.friends || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'posts' as const, label: t('profile.postsCount'), icon: Grid, count: userPosts.length },
    { id: 'friends' as const, label: t('profile.friendsCount'), icon: Users, count: userFriends.length },
    { id: 'photos' as const, label: t('profile.photos'), icon: ImageIcon, count: userPosts.filter((p) => p.mediaUrl).length },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Profile Section */}
      <ProfileHeader user={user} isOwnProfile />

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center justify-center gap-2 flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all',
                isActive
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-xs opacity-60">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="py-16 text-center text-xs text-slate-400">
              {t('feed.noPosts')}
            </div>
          )}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userFriends.length > 0 ? (
            userFriends.map((f) => <FriendCard key={f.id} user={f} initialStatus="friends" />)
          ) : (
            <div className="col-span-2 py-16 text-center text-xs text-slate-400">
              {t('friends.noFriends')}
            </div>
          )}
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userPosts
            .filter((p) => p.mediaUrl)
            .map((post) => (
              <div key={post.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-dark-elevated">
                <img src={post.mediaUrl} alt="Photo" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
