'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Conversation, Message } from '@/types';

export const CONVERSATIONS_QUERY_KEY = ['conversations'];
export const messagesQueryKey = (conversationId: string) => ['messages', conversationId];

export function useConversationsQuery() {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery<{ conversations: Conversation[] }>({
    queryKey: CONVERSATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    },
  });

  return {
    conversations: conversationsQuery.data?.conversations || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    refetch: conversationsQuery.refetch,
  };
}

export function useMessagesQuery(conversationId: string) {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery<{ messages: Message[] }>({
    queryKey: messagesQueryKey(conversationId),
    queryFn: async () => {
      if (!conversationId) return { messages: [] };
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    enabled: Boolean(conversationId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (payload: { content: string; type?: 'text' | 'voice' | 'image'; mediaUrl?: string; duration?: number }) => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send message');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<{ messages: Message[] }>(messagesQueryKey(conversationId), (old) => {
        if (!old) return { messages: [data.message] };
        return { messages: [...old.messages, data.message] };
      });
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    },
  });

  return {
    messages: messagesQuery.data?.messages || [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    refetch: messagesQuery.refetch,
    sendMessage: sendMessageMutation.mutateAsync,
  };
}
