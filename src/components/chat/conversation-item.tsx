'use client';

import React from 'react';
import Link from 'next/link';
import { Conversation } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { formatTimeAgo, cn } from '@/lib/utils';
import { Mic, Image as ImageIcon } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive = false,
}) => {
  const { user } = useAuth();
  const { language, t } = useI18n();

  // The other chat participant
  const otherUser = conversation.participants.find((p) => p.id !== user?.id) || conversation.participants[0];

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className={cn(
        'flex items-center gap-3.5 p-3.5 rounded-2xl transition-all select-none',
        isActive
          ? 'bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/40'
          : 'hover:bg-slate-100 dark:hover:bg-dark-elevated'
      )}
    >
      <Avatar
        src={otherUser.avatar}
        fallbackName={otherUser.name}
        size="lg"
        isOnline={otherUser.isOnline}
        showOnlineStatus
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text truncate">
            {otherUser.name}
          </h4>
          {conversation.lastMessage && (
            <span className="text-[10px] text-slate-400 flex-shrink-0">
              {formatTimeAgo(conversation.lastMessage.createdAt, language)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
            {conversation.lastMessage?.type === 'voice' && (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span>{t('chat.voiceMessage')}</span>
              </>
            )}
            {conversation.lastMessage?.type === 'image' && (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{t('chat.imageMessage')}</span>
              </>
            )}
            {(!conversation.lastMessage?.type || conversation.lastMessage.type === 'text') && (
              <span>{conversation.lastMessage?.content || t('chat.startChat')}</span>
            )}
          </p>

          {conversation.unreadCount > 0 && (
            <span className="min-w-[18px] h-4.5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
