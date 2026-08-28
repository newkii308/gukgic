'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, NotificationItem } from '@/types';

export function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const socket = io({
      path: '/api/socket',
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join_conversation', { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave_conversation', { conversationId });
  }, []);

  const sendMessage = useCallback((data: {
    conversationId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
    duration?: number;
    replyTo?: { id: string; senderName: string; content: string };
  }) => {
    socketRef.current?.emit('send_message', data);
  }, []);

  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { conversationId, isTyping, userId });
  }, [userId]);

  const onNewMessage = useCallback((handler: (message: Message) => void) => {
    socketRef.current?.on('new_message', handler);
    return () => {
      socketRef.current?.off('new_message', handler);
    };
  }, []);

  const onTyping = useCallback((handler: (data: { userId: string; isTyping: boolean }) => void) => {
    socketRef.current?.on('user_typing', handler);
    return () => {
      socketRef.current?.off('user_typing', handler);
    };
  }, []);

  const onNotification = useCallback((handler: (notif: NotificationItem) => void) => {
    socketRef.current?.on('new_notification', handler);
    return () => {
      socketRef.current?.off('new_notification', handler);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    onNewMessage,
    onTyping,
    onNotification,
  };
}
