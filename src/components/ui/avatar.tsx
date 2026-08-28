import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  className?: string;
  fallbackName?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  isOnline = false,
  showOnlineStatus = false,
  className,
  fallbackName,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
    '2xl': 'w-5 h-5 ring-3',
  };

  const initials = fallbackName
    ? fallbackName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=6366f1&color=fff`;

  return (
    <div className={cn('relative inline-block flex-shrink-0 select-none', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-slate-200 dark:bg-dark-elevated flex items-center justify-center font-medium text-slate-600 dark:text-slate-300 ring-2 ring-transparent transition-all',
          sizeClasses[size]
        )}
      >
        <img
          src={src || defaultAvatar}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultAvatar;
          }}
        />
      </div>

      {showOnlineStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-dark-card',
            statusSizeClasses[size],
            isOnline ? 'bg-emerald-500 ring-offset-0' : 'bg-slate-400'
          )}
        />
      )}
    </div>
  );
};
