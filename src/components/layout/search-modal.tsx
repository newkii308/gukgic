'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Sparkles, UserPlus, MessageCircle, ArrowRight } from 'lucide-react';
import { User } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.users || []);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('app.search')} maxWidth="lg">
      <div className="space-y-4">
        {/* Search Input */}
        <Input
          placeholder={t('app.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          icon={<Search className="w-4 h-4" />}
        />

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-400">
              {t('app.loading')}
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <Link
                key={user.id}
                href={`/u/${user.username}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={user.avatar}
                    fallbackName={user.name}
                    size="md"
                    isOnline={user.isOnline}
                    showOnlineStatus
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text truncate group-hover:text-primary-600 transition-colors">
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                    {user.location && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{user.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-[140px] justify-end">
                    {user.interests.slice(0, 2).map((item) => (
                      <Badge key={item} size="sm" variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          ) : query.trim() ? (
            <div className="py-8 text-center text-sm text-slate-400">
              {t('friends.noFriends')}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              {t('friends.findFriends')}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
