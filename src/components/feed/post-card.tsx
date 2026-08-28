'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostComments } from './post-comments';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { formatTimeAgo, cn } from '@/lib/utils';
import { NativeShare } from '@/lib/capacitor';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flag,
  UserX,
  Copy,
  Check
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const { language, t } = useI18n();

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const handleLike = async () => {
    // Optimistic UI update
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
    } catch {
      // Revert if error
      setIsLiked(!nextState);
      setLikesCount((prev) => (!nextState ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const handleShare = async () => {
    await NativeShare.share({
      title: `${post.author.name} on Friend Social`,
      text: post.content,
      url: typeof window !== 'undefined' ? `${window.location.origin}/u/${post.author.username}` : '',
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/u/${post.author.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setMenuOpen(false);
    }
  };

  const handleReport = async () => {
    try {
      await fetch('/api/moderation/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'post',
          targetId: post.id,
          reason: 'Inappropriate content',
        }),
      });
      setReported(true);
      setMenuOpen(false);
    } catch {
      //
    }
  };

  return (
    <article className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm space-y-3.5 transition-all hover:border-slate-300 dark:hover:border-slate-700/80">
      {/* Header: Author Info & Menu */}
      <div className="flex items-center justify-between">
        <Link
          href={`/u/${post.author.username}`}
          className="flex items-center gap-3 group select-none"
        >
          <Avatar
            src={post.author.avatar}
            fallbackName={post.author.name}
            size="md"
            isOnline={post.author.isOnline}
            showOnlineStatus
          />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {post.author.name}
            </h3>
            <p className="text-[11px] text-slate-400">
              @{post.author.username} • {formatTimeAgo(post.createdAt, language)}
            </p>
          </div>
        </Link>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-30 animate-scale-up">
              {copied ? (
                <div className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-emerald-600">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('app.success')}</span>
                </div>
              ) : (
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </button>
              )}

              {user && (user.id === post.userId || user.role === 'admin') && (
                <button
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this post?')) return;
                    try {
                      await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
                      if (onDelete) onDelete(post.id);
                    } catch {}
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-semibold"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>
              )}

              <button
                onClick={handleReport}
                className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{reported ? t('moderation.reportSubmitted') : t('moderation.reportPost')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
        {post.content}
      </p>

      {/* Media Image */}
      {post.mediaUrl && (
        <div className="rounded-2xl overflow-hidden max-h-96 w-full bg-slate-100 dark:bg-dark-elevated">
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full h-full object-cover select-none"
            loading="lazy"
          />
        </div>
      )}

      {/* Post Interactive Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 select-none">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-90',
            isLiked
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated'
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isLiked ? 'fill-rose-500 scale-110 text-rose-500' : ''
            )}
          />
          <span>{likesCount > 0 ? likesCount : t('feed.like')}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span>{commentsCount > 0 ? commentsCount : t('feed.comment')}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span>{t('feed.share')}</span>
        </button>
      </div>

      {/* Comment Section Dropdown */}
      {showComments && (
        <PostComments
          postId={post.id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}
    </article>
  );
};
