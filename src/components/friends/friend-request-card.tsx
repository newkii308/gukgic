'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FriendRequest } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { Check, X, MapPin } from 'lucide-react';

interface FriendRequestCardProps {
  request: FriendRequest;
  onResolved?: (id: string, status: 'accepted' | 'rejected') => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onResolved,
}) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(request.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      });
      if (res.ok) {
        setStatus('accepted');
        if (onResolved) onResolved(request.id, 'accepted');
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      });
      if (res.ok) {
        setStatus('rejected');
        if (onResolved) onResolved(request.id, 'rejected');
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'pending') return null;

  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Link href={`/u/${request.sender.username}`}>
          <Avatar
            src={request.sender.avatar}
            fallbackName={request.sender.name}
            size="lg"
            isOnline={request.sender.isOnline}
            showOnlineStatus
          />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/u/${request.sender.username}`}
            className="text-sm font-bold text-slate-900 dark:text-dark-text hover:underline truncate block"
          >
            {request.sender.name}
          </Link>
          <p className="text-xs text-slate-400 truncate">@{request.sender.username}</p>
          {request.sender.location && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{request.sender.location}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          onClick={handleAccept}
          isLoading={isLoading}
          size="sm"
          className="rounded-xl px-3 bg-emerald-600 hover:bg-emerald-700 text-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('friends.accept')}</span>
        </Button>
        <Button
          variant="secondary"
          onClick={handleReject}
          disabled={isLoading}
          size="sm"
          className="rounded-xl px-3 text-xs"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('friends.reject')}</span>
        </Button>
      </div>
    </div>
  );
};
