'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Smile, Send, X } from 'lucide-react';
import { NativeCamera } from '@/lib/capacitor';
import { Post } from '@/types';

interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const res = await NativeCamera.pickImage();
    if (res?.dataUrl) {
      setMediaUrl(res.dataUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), mediaUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent('');
        setMediaUrl(null);
        if (onPostCreated) onPostCreated(data.post);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex gap-3">
        <Avatar
          src={user.avatar}
          fallbackName={user.name}
          size="md"
          isOnline={user.isOnline}
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('feed.whatsOnYourMind')}
            rows={2}
            className="w-full bg-slate-50 dark:bg-dark-elevated rounded-2xl p-3 text-sm text-slate-900 dark:text-dark-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border border-slate-200/50 dark:border-slate-800 transition-all resize-none"
          />

          {/* Media Preview */}
          {mediaUrl && (
            <div className="relative mt-2 rounded-2xl overflow-hidden max-h-60 bg-slate-100 dark:bg-dark-elevated">
              <img src={mediaUrl} alt="Upload preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setMediaUrl(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePickImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span>{t('feed.photo')}</span>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={(!content.trim() && !mediaUrl) || isLoading}
          isLoading={isLoading}
          size="sm"
          className="rounded-xl px-5"
        >
          <span>{t('feed.post')}</span>
        </Button>
      </div>
    </div>
  );
};
