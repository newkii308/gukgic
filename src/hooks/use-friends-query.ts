'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, FriendRequest } from '@/types';

export const FRIENDS_QUERY_KEY = ['friends'];
export const DISCOVER_QUERY_KEY = ['discover'];

export function useFriendsQuery() {
  const queryClient = useQueryClient();

  const friendsQuery = useQuery<{ friends: User[]; requests: FriendRequest[] }>({
    queryKey: FRIENDS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/friends');
      if (!res.ok) throw new Error('Failed to fetch friends');
      return res.json();
    },
  });

  const sendRequestMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send request');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DISCOVER_QUERY_KEY });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) throw new Error('Failed to accept request');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) throw new Error('Failed to reject request');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await fetch('/api/friends', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (!res.ok) throw new Error('Failed to remove friend');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
    },
  });

  return {
    friends: friendsQuery.data?.friends || [],
    requests: friendsQuery.data?.requests || [],
    isLoading: friendsQuery.isLoading,
    isError: friendsQuery.isError,
    refetch: friendsQuery.refetch,
    sendRequest: sendRequestMutation.mutateAsync,
    acceptRequest: acceptRequestMutation.mutateAsync,
    rejectRequest: rejectRequestMutation.mutateAsync,
    removeFriend: removeFriendMutation.mutateAsync,
  };
}
