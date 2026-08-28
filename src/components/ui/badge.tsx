import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'ad';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className,
}) => {
  const variants = {
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200 dark:border-primary-800/40',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-dark-elevated dark:text-slate-300 border border-slate-200 dark:border-slate-800',
    accent: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40',
    ad: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30 font-semibold tracking-wider uppercase',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full',
    md: 'text-xs px-2.5 py-1 rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
