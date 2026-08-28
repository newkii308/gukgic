'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { UserPlus, Check, Sparkles } from 'lucide-react';

export const FeedSuggestions: React.FC = () => {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch('/api/friends/discover');
      if (res.ok) {
        const data = await res.json();
        setUsers((data.users || []).slice(0, 3));
      }
    } catch {
      //
    }
  };

  const handleAddFriend = async (targetId: string) => {
    setSentRequests((prev) => ({ ...prev, [targetId]: true }));
    try {
      await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: targetId }),
      });
    } catch {
      //
    }
  };

  if (users.length === 0) return null;

  return (
    <div className="rounded-3xl bg-primary-50/60 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t('feed.suggestedFriends')}
          </h4>
        </div>
        <Link
          href="/friends"
          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
        >
          {t('feed.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {users.map((u) => {
          const isSent = sentRequests[u.id];
          return (
            <div
              key={u.id}
              className="flex flex-col items-center text-center p-3 rounded-2xl bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              <Link href={`/u/${u.username}`}>
                <Avatar
                  src={u.avatar}
                  fallbackName={u.name}
                  size="lg"
                  isOnline={u.isOnline}
                  showOnlineStatus
                />
              </Link>
              <div className="min-w-0 w-full">
                <Link
                  href={`/u/${u.username}`}
                  className="text-xs font-bold text-slate-900 dark:text-dark-text truncate block hover:underline"
                >
                  {u.name}
                </Link>
                <p className="text-[11px] text-slate-400 truncate">
                  {u.interests[0] || u.city || 'Laos'}
                </p>
              </div>

              <Button
                size="sm"
                variant={isSent ? 'secondary' : 'primary'}
                onClick={() => handleAddFriend(u.id)}
                disabled={isSent}
                className="w-full text-xs h-7 rounded-xl"
              >
                {isSent ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{t('friends.requested')}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>{t('friends.addFriend')}</span>
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
