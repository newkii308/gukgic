'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Plus } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setActiveUsers(data.users || []);
      }
    } catch {
      //
    }
  };

  return (
    <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none select-none">
      {/* Current User Story Add */}
      {user && (
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="p-0.5 rounded-full ring-2 ring-dashed ring-slate-300 dark:ring-slate-700 group-hover:ring-primary-500 transition-all">
              <Avatar
                src={user.avatar}
                fallbackName={user.name}
                size="lg"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-primary-600 text-white ring-2 ring-white dark:ring-dark-bg">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 w-14 text-center truncate">
            {user.name.split(' ')[0]}
          </span>
        </div>
      )}

      {/* Online / Active Friends Stories */}
      {activeUsers
        .filter((u) => u.id !== user?.id)
        .map((u) => (
          <Link
            key={u.id}
            href={`/u/${u.username}`}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary-500 via-rose-400 to-amber-400 group-hover:scale-105 transition-transform">
              <div className="p-0.5 rounded-full bg-white dark:bg-dark-bg">
                <Avatar
                  src={u.avatar}
                  fallbackName={u.name}
                  size="lg"
                  isOnline={u.isOnline}
                  showOnlineStatus
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 w-14 text-center truncate group-hover:text-primary-600 transition-colors">
              {u.name.split(' ')[0]}
            </span>
          </Link>
        ))}
    </div>
  );
};
