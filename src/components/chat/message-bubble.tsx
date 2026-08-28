'use client';

import React, { useState } from 'react';
import { Message } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { VoicePlayer } from './voice-player';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { formatTimeAgo, cn } from '@/lib/utils';
import { Check, CheckCheck, MoreVertical, Trash2, CornerUpLeft } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onReply?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReply,
  onDelete,
}) => {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSender = user?.id === message.senderId;

  return (
    <div
      className={cn(
        'flex gap-2.5 items-end group select-none relative',
        isSender ? 'flex-row-reverse self-end' : 'self-start'
      )}
    >
      {!isSender && (
        <Avatar
          src={message.sender.avatar}
          fallbackName={message.sender.name}
          size="sm"
          className="mb-1"
        />
      )}

      {/* Bubble Container */}
      <div className="relative max-w-[82%] sm:max-w-[70%]">
        {/* Reply Quote Banner */}
        {message.replyTo && (
          <div
            className={cn(
              'text-[11px] px-3 py-1.5 rounded-t-2xl border-b border-white/20 mb-[-4px]',
              isSender
                ? 'bg-primary-700/60 text-white/90'
                : 'bg-slate-200/80 dark:bg-dark-card text-slate-600 dark:text-slate-300'
            )}
          >
            <span className="font-bold">{message.replyTo.senderName}: </span>
            <span className="truncate">{message.replyTo.content}</span>
          </div>
        )}

        <div
          className={cn(
            'px-4 py-2.5 rounded-3xl text-sm transition-all shadow-sm',
            isSender
              ? 'bg-primary-600 text-white rounded-br-md shadow-primary-500/10'
              : 'bg-white dark:bg-dark-card text-slate-900 dark:text-dark-text rounded-bl-md border border-slate-200/70 dark:border-slate-800/80'
          )}
        >
          {/* Text Message */}
          {message.type === 'text' && (
            <p className="whitespace-pre-line leading-relaxed text-sm select-text">
              {message.content}
            </p>
          )}

          {/* Voice Message */}
          {message.type === 'voice' && (
            <VoicePlayer
              mediaUrl={message.mediaUrl}
              duration={message.duration || 8}
              isSender={isSender}
            />
          )}

          {/* Image Message */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="rounded-2xl overflow-hidden max-h-60 mb-1">
              <img
                src={message.mediaUrl}
                alt="Chat attachment"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Timestamp and Read Receipts */}
          <div
            className={cn(
              'flex items-center justify-end gap-1 mt-1 text-[10px]',
              isSender ? 'text-white/70' : 'text-slate-400'
            )}
          >
            <span>{formatTimeAgo(message.createdAt, language)}</span>
            {isSender && (
              <span>
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3 text-sky-300" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Hover / Long-press menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            'absolute top-1 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-dark-card shadow-sm',
            isSender ? '-left-7' : '-right-7'
          )}
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {menuOpen && (
          <div
            className={cn(
              'absolute top-6 w-32 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1 z-30 animate-scale-up',
              isSender ? 'right-0' : 'left-0'
            )}
          >
            {onReply && (
              <button
                onClick={() => {
                  onReply(message);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
                <span>{t('chat.reply')}</span>
              </button>
            )}

            {isSender && onDelete && (
              <button
                onClick={() => {
                  onDelete(message.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('chat.unsendMessage')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
