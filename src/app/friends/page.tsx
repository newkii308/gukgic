'use client';

import React, { useState, useEffect } from 'react';
import { User, FriendRequest } from '@/types';
import { DiscoverSection } from '@/components/friends/discover-section';
import { FriendCard } from '@/components/friends/friend-card';
import { FriendRequestCard } from '@/components/friends/friend-request-card';
import { useI18n } from '@/hooks/use-i18n';
import { Users, UserPlus, Inbox, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FriendsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'my-friends'>('discover');
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends');
      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
        setRequests(data.requests || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResolved = (id: string, status: 'accepted' | 'rejected') => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (status === 'accepted') {
      fetchFriendsData();
    }
  };

  const tabs = [
    {
      id: 'discover' as const,
      label: t('friends.findFriends'),
      icon: Compass,
    },
    {
      id: 'requests' as const,
      label: t('friends.requests'),
      icon: Inbox,
      badge: requests.length,
    },
    {
      id: 'my-friends' as const,
      label: t('friends.myFriends'),
      icon: Users,
      count: friends.length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Tab Navigation Header */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-x-auto select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex-1 justify-center whitespace-nowrap',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  isActive ? 'bg-white text-primary-600' : 'bg-rose-500 text-white'
                )}>
                  {tab.badge}
                </span>
              ) : null}
              {tab.count !== undefined && !tab.badge ? (
                <span className={cn(
                  'text-[11px] opacity-75',
                  isActive ? 'text-white' : 'text-slate-400'
                )}>
                  ({tab.count})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Discover */}
      {activeTab === 'discover' && <DiscoverSection />}

      {/* Tab 2: Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length > 0 ? (
            requests.map((req) => (
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
                When someone adds you as a friend, their request will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Friends */}
      {activeTab === 'my-friends' && (
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
    </div>
  );
}
