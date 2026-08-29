'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types';

export const POSTS_QUERY_KEY = ['posts'];

export function usePostsQuery() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery<{ posts: Post[]; nextCursor: string | null }>({
    queryKey: POSTS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch('/api/posts?limit=20');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });

  // Optimistic Like Mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to like post');
      return res.json();
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousData = queryClient.getQueryData<{ posts: Post[]; nextCursor: string | null }>(POSTS_QUERY_KEY);

      if (previousData) {
        queryClient.setQueryData(POSTS_QUERY_KEY, {
          ...previousData,
          posts: previousData.posts.map((p) => {
            if (p.id === postId) {
              const nextIsLiked = !p.isLiked;
              return {
                ...p,
                isLiked: nextIsLiked,
                likesCount: nextIsLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
              };
            }
            return p;
          }),
        });
      }

      return { previousData };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  // Optimistic Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: async (payload: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' }) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  return {
    posts: postsQuery.data?.posts || [],
    isLoading: postsQuery.isLoading,
    isError: postsQuery.isError,
    error: postsQuery.error,
    refetch: postsQuery.refetch,
    toggleLike: toggleLikeMutation.mutate,
    createPost: createPostMutation.mutateAsync,
  };
}
