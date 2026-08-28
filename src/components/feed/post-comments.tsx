'use client';

import React, { useState, useEffect } from 'react';
import { PostComment } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { formatTimeAgo } from '@/lib/utils';
import { Send } from 'lucide-react';
import Link from 'next/link';

interface PostCommentsProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const PostComments: React.FC<PostCommentsProps> = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setNewComment('');
        if (onCommentAdded) onCommentAdded();
      }
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
      {/* Existing Comments */}
      {isLoading ? (
        <div className="text-center py-2 text-xs text-slate-400">
          {t('app.loading')}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-2.5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 items-start">
              <Link href={`/u/${comment.author.username}`}>
                <Avatar
                  src={comment.author.avatar}
                  fallbackName={comment.author.name}
                  size="sm"
                />
              </Link>
              <div className="flex-1 bg-slate-100/80 dark:bg-dark-elevated rounded-2xl px-3.5 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    href={`/u/${comment.author.username}`}
                    className="text-xs font-bold text-slate-900 dark:text-dark-text hover:underline"
                  >
                    {comment.author.name}
                  </Link>
                  <span className="text-[10px] text-slate-400">
                    {formatTimeAgo(comment.createdAt, language)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Input */}
      {user && (
        <form onSubmit={handleAddComment} className="flex gap-2 items-center">
          <Avatar src={user.avatar} fallbackName={user.name} size="sm" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('feed.writeComment')}
            className="flex-1 h-9 rounded-xl bg-slate-100 dark:bg-dark-elevated px-3 text-xs text-slate-900 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 border border-transparent dark:border-slate-800"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
            className="h-9 px-3 rounded-xl"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      )}
    </div>
  );
};
