'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, FriendshipStatus } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/hooks/use-i18n';
import { MapPin, UserPlus, Check, MessageCircle, X, Users } from 'lucide-react';

interface FriendCardProps {
  user: User;
  initialStatus?: FriendshipStatus;
  onStatusChange?: (newStatus: FriendshipStatus) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  user,
  initialStatus = 'none',
  onStatusChange,
}) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<FriendshipStatus>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      if (res.ok) {
        setStatus('pending');
        if (onStatusChange) onStatusChange('pending');
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      if (res.ok) {
        setStatus('none');
        if (onStatusChange) onStatusChange('none');
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      if (res.ok) {
        setStatus('friends');
        if (onStatusChange) onStatusChange('friends');
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700/80 transition-all flex flex-col justify-between">
      <div className="flex items-start gap-3.5">
        <Link href={`/u/${user.username}`}>
          <Avatar
            src={user.avatar}
            fallbackName={user.name}
            size="lg"
            isOnline={user.isOnline}
            showOnlineStatus
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={`/u/${user.username}`}
            className="text-sm font-bold text-slate-900 dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 truncate block transition-colors"
          >
            {user.name}
          </Link>
          <p className="text-xs text-slate-400 truncate">@{user.username}</p>

          {user.location && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.location}</span>
            </p>
          )}

          {user.mutualFriendsCount && user.mutualFriendsCount > 0 ? (
            <p className="text-[11px] text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" />
              <span>{t('friends.mutualFriends', { count: user.mutualFriendsCount })}</span>
            </p>
          ) : null}
        </div>
      </div>

      {/* Bio / Quote */}
      {user.bio && (
        <p className="text-xs text-slate-600 dark:text-dark-muted line-clamp-2 leading-relaxed">
          {user.bio}
        </p>
      )}

      {/* Interests Chips */}
      {user.interests && user.interests.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {user.interests.slice(0, 3).map((item) => (
            <Badge key={item} size="sm" variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      )}

      {/* Dynamic Action Buttons based on status */}
      <div className="pt-2 flex items-center gap-2">
        {status === 'none' && (
          <Button
            onClick={handleAddFriend}
            isLoading={isLoading}
            size="sm"
            className="w-full text-xs rounded-xl"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('friends.addFriend')}</span>
          </Button>
        )}

        {status === 'pending' && (
          <Button
            variant="secondary"
            onClick={handleCancelRequest}
            isLoading={isLoading}
            size="sm"
            className="w-full text-xs rounded-xl text-slate-600 hover:text-red-500"
          >
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('friends.requested')}</span>
          </Button>
        )}

        {status === 'incoming' && (
          <Button
            onClick={handleAcceptRequest}
            isLoading={isLoading}
            size="sm"
            className="w-full text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('friends.accept')}</span>
          </Button>
        )}

        {status === 'friends' && (
          <Link href={`/messages`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs rounded-xl text-primary-600 dark:text-primary-400 border-primary-500/30"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('friends.message')}</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
