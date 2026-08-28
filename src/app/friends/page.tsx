'use client';

import React, { useState, useEffect } from 'react';
import { User, FriendRequest } from '@/types';
import { DiscoverSection } from '@/components/friends/discover-section';
import { FriendCard } from '@/components/friends/friend-card';
import { FriendRequestCard } from '@/components/friends/friend-request-card';
import { useI18n } from '@/hooks/use-i18n';
import { Users, UserPlus, Inbox, Compass, Send, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FriendsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'discover' | 'incoming' | 'sent' | 'friends' | 'blocked'>('discover');
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    setIsLoading(true);
    try {
      const [friendsRes, blockedRes] = await Promise.all([
        fetch('/api/friends'),
        fetch('/api/friends/blocked'),
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friends || []);
        setIncomingRequests(data.requests || []);
        setSentRequests(data.sentRequests || []);
      }

      if (blockedRes.ok) {
        const bData = await blockedRes.json();
        setBlockedUsers(bData.blocked || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResolved = (id: string, status: 'accepted' | 'rejected') => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
    if (status === 'accepted') {
      fetchFriendsData();
    }
  };

  const handleCancelSent = async (targetUserId: string) => {
    try {
      await fetch('/api/friends/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      setSentRequests((prev) => prev.filter((r) => r.receiverId !== targetUserId));
    } catch {
      //
    }
  };

  const handleUnblock = async (blockedId: string) => {
    try {
      await fetch('/api/moderation/block', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: blockedId }),
      });
      setBlockedUsers((prev) => prev.filter((u) => u.id !== blockedId));
    } catch {
      //
    }
  };

  const tabs = [
    {
      id: 'discover' as const,
      label: t('friends.findFriends'),
      icon: Compass,
    },
    {
      id: 'incoming' as const,
      label: t('friends.requests'),
      icon: Inbox,
      badge: incomingRequests.length,
    },
    {
      id: 'sent' as const,
      label: 'Sent',
      icon: Send,
      count: sentRequests.length,
    },
    {
      id: 'friends' as const,
      label: t('friends.myFriends'),
      icon: Users,
      count: friends.length,
    },
    {
      id: 'blocked' as const,
      label: 'Blocked',
      icon: UserX,
      count: blockedUsers.length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sub-Navigation Tabs under Friends */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-x-auto select-none scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-1 justify-center whitespace-nowrap',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-white text-primary-600' : 'bg-rose-500 text-white'
                )}>
                  {tab.badge}
                </span>
              ) : null}
              {tab.count !== undefined && !tab.badge && tab.count > 0 ? (
                <span className={cn(
                  'text-[10px] opacity-75',
                  isActive ? 'text-white' : 'text-slate-400'
                )}>
                  ({tab.count})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Discover & Suggestions */}
      {activeTab === 'discover' && <DiscoverSection />}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className="space-y-3">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((req) => (
              <FriendRequestCard
                key={req.id}
                request={req}
                onResolved={handleRequestResolved}
              />
            ))
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-8 space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t('friends.noRequests')}
              </p>
              <p className="text-xs text-slate-400">
                When someone sends you a friend request, it will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-3">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3.5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.receiver.avatar}
                    alt={req.receiver.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text">{req.receiver.name}</h4>
                    <p className="text-xs text-slate-400">@{req.receiver.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancelSent(req.receiverId)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition-colors"
                >
                  Cancel Request
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-8 text-xs text-slate-400">
              No outgoing pending friend requests
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Friends List */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  user={friend}
                  initialStatus="friends"
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-8 space-y-3">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {t('friends.noFriends')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Blocked Users */}
      {activeTab === 'blocked' && (
        <div className="space-y-3">
          {blockedUsers.length > 0 ? (
            blockedUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3.5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover grayscale opacity-70"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text">{u.name}</h4>
                    <p className="text-xs text-slate-400">@{u.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(u.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 transition-colors"
                >
                  Unblock
                </button>
              </div>
            ))
          ) : (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-8 text-xs text-slate-400">
              No blocked users
            </div>
          )}
        </div>
      )}
    </div>
  );
}
