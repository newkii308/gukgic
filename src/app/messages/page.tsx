'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Conversation } from '@/types';
import { ConversationItem } from '@/components/chat/conversation-item';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { Input } from '@/components/ui/input';
import { MessageCircle, Search, Plus } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = conversations.filter((c) => {
    const other = c.participants.find((p) => p.id !== user?.id) || c.participants[0];
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary-500" />
          <span>{t('chat.title')}</span>
        </h1>

        <Link
          href="/friends"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-bold hover:bg-primary-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t('friends.findFriends')}</span>
        </Link>
      </div>

      {/* Search Input */}
      <Input
        placeholder={t('app.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {/* List */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-2 sm:p-3 shadow-sm space-y-1">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {t('app.loading')}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t('chat.noConversations')}
            </p>
            <Link
              href="/friends"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary-600 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('friends.findFriends')}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
