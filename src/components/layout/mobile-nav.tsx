'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  User,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  unreadMessagesCount = 1,
  unreadNotificationsCount = 1,
}) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
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
      badge: unreadMessagesCount,
    },
    {
      href: '/notifications',
      label: t('nav.notifications'),
      icon: Bell,
      isActive: pathname.startsWith('/notifications'),
      badge: unreadNotificationsCount,
    },
    {
      href: '/profile',
      label: t('nav.profile'),
      icon: User,
      isActive: pathname.startsWith('/profile'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all select-none',
                item.isActive
                  ? 'text-primary-600 dark:text-primary-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    item.isActive ? 'scale-110 stroke-[2.5]' : 'scale-100'
                  )}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-dark-bg">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="mt-1 leading-none">{item.label}</span>
              {item.isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-600 dark:bg-primary-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
