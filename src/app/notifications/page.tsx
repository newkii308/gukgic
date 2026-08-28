'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NotificationItem } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { formatTimeAgo, cn } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  UserPlus,
  Heart,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function NotificationsPage() {
  const { language, t } = useI18n();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      //
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'friend_request':
      case 'friend_accept':
        return <UserPlus className="w-4 h-4 text-primary-500" />;
      case 'post_like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'post_comment':
        return <MessageCircle className="w-4 h-4 text-sky-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary-500" />
          <span>{t('notifications.title')}</span>
        </h1>

        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notifications.markAllAsRead')}</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-2 sm:p-3 shadow-sm space-y-1">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {t('app.loading')}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all',
                notif.isRead
                  ? 'hover:bg-slate-50 dark:hover:bg-dark-elevated'
                  : 'bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  {notif.sender ? (
                    <Avatar
                      src={notif.sender.avatar}
                      fallbackName={notif.sender.name}
                      size="md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600">
                      <Bell className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-dark-card shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-dark-text">
                    {notif.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {notif.body}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {formatTimeAgo(notif.createdAt, language)}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0" />
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">
            {t('notifications.noNotifications')}
          </div>
        )}
      </div>
    </div>
  );
}
