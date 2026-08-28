'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Conversation, Message, User } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { useSocket } from '@/hooks/use-socket';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    joinConversation,
    leaveConversation,
    sendMessage: socketSendMessage,
    sendTyping: socketSendTyping,
    onNewMessage,
    onTyping,
  } = useSocket(user?.id);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    fetchConversationDetails();
    joinConversation(conversationId);

    const unsubMsg = onNewMessage((newMsg) => {
      if (newMsg.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(() => scrollToBottom(), 100);
      }
    });

    const unsubTyping = onTyping((data) => {
      if (data.userId !== user?.id) {
        setOtherUserTyping(data.isTyping);
      }
    });

    return () => {
      leaveConversation(conversationId);
      unsubMsg();
      unsubTyping();
    };
  }, [conversationId, user?.id]);

  const fetchConversationDetails = async () => {
    setIsLoading(true);
    try {
      const [convRes, msgRes] = await Promise.all([
        fetch(`/api/conversations/${conversationId}`),
        fetch(`/api/conversations/${conversationId}/messages`),
      ]);

      if (convRes.ok) {
        const convData = await convRes.json();
        setConversation(convData.conversation);
      }

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
        setTimeout(() => scrollToBottom(false), 100);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (params: {
    content: string;
    type?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
    duration?: number;
    replyTo?: { id: string; senderName: string; content: string };
  }) => {
    if (!user) return;

    // Optimistic message
    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      senderId: user.id,
      sender: user,
      content: params.content,
      type: params.type || 'text',
      mediaUrl: params.mediaUrl,
      duration: params.duration,
      replyTo: params.replyTo,
      isRead: false,
      isDelivered: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
        socketSendMessage({
          conversationId,
          senderId: user.id,
          ...data.message,
        });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch {
      //
    }
  };

  const otherUser = conversation?.participants.find((p) => p.id !== user?.id) || conversation?.participants[0];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-3xl bg-slate-50/50 dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 shadow-sm overflow-hidden">
      {/* Chat Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-card border-b border-slate-200/70 dark:border-slate-800/80 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/messages"
            className="md:hidden p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {otherUser && (
            <Link
              href={`/u/${otherUser.username}`}
              className="flex items-center gap-3 group min-w-0"
            >
              <Avatar
                src={otherUser.avatar}
                fallbackName={otherUser.name}
                size="md"
                isOnline={otherUser.isOnline}
                showOnlineStatus
              />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text group-hover:text-primary-600 transition-colors truncate">
                  {otherUser.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {otherUser.isOnline ? (
                    <span className="text-emerald-500 font-medium">{t('app.online')}</span>
                  ) : (
                    otherUser.lastSeen || t('app.offline')
                  )}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Future Voice / Video Call Stubs */}
        <div className="flex items-center gap-1 text-slate-400">
          <Link
            href={`/u/${otherUser?.username}`}
            className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <Info className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {t('app.loading')}
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReply={(msg) => setReplyingTo(msg)}
              onDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="py-16 text-center text-xs text-slate-400">
            {t('chat.noConversations')}
          </div>
        )}

        {/* Typing indicator */}
        {otherUserTyping && otherUser && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic px-2 animate-pulse">
            <span>{t('chat.typing', { name: otherUser.name })}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={(isTyping) => socketSendTyping(conversationId, isTyping)}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};
