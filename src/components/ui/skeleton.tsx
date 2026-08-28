import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-slate-200/80 dark:bg-dark-elevated',
        className
      )}
    />
  );
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-56 rounded-2xl" />
      <div className="flex justify-between pt-2">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
};
