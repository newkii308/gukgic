'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings,
  Sparkles,
  Compass,
  Bookmark,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const mainLinks = [
    {
      href: '/',
      label: t('nav.home'),
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/friends',
      label: t('nav.friends'),
      icon: Users,
      isActive: pathname.startsWith('/friends'),
    },
    {
      href: '/messages',
      label: t('nav.messages'),
      icon: MessageCircle,
      isActive: pathname.startsWith('/messages'),
    },
    {
      href: '/notifications',
      label: t('nav.notifications'),
      icon: Bell,
      isActive: pathname.startsWith('/notifications'),
    },
    {
      href: '/profile',
      label: t('nav.profile'),
      icon: User,
      isActive: pathname.startsWith('/profile'),
    },
    {
      href: '/settings',
      label: t('nav.settings'),
      icon: Settings,
      isActive: pathname.startsWith('/settings'),
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] pb-4 select-none">
      {/* User Mini Profile Card */}
      {user && (
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3.5 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all shadow-sm mb-4 group"
        >
          <Avatar
            src={user.avatar}
            fallbackName={user.name}
            size="md"
            isOnline={user.isOnline}
            showOnlineStatus
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {user.name}
            </h4>
            <p className="text-xs text-slate-400 truncate">@{user.username}</p>
          </div>
        </Link>
      )}

      {/* Main Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group',
                item.isActive
                  ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-card hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  item.isActive ? 'text-primary-600 dark:text-primary-400 stroke-[2.5]' : 'text-slate-400'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('nav.logout')}</span>
        </button>
        <p className="text-[11px] text-slate-400 px-4">
          Friend Social © 2026 Laos 🇱🇦
        </p>
      </div>
    </aside>
  );
};
