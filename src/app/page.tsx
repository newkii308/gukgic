'use client';

import React, { useState, useEffect } from 'react';
import { Post, Advertisement } from '@/types';
import { StoriesBar } from '@/components/feed/stories-bar';
import { CreatePost } from '@/components/feed/create-post';
import { PostCard } from '@/components/feed/post-card';
import { FeedSuggestions } from '@/components/feed/feed-suggestions';
import { AdCard } from '@/components/ads/ad-card';
import { PostCardSkeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';

export default function HomePage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const [postsRes, adsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/ads'),
      ]);

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }

      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAds(adsData.ads || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Active Stories Bar */}
      <StoriesBar />

      {/* Create New Post Widget */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Main Feed Feed Stream with Interleaved Suggestions and Ads */}
      {isLoading ? (
        <div className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-5">
          {posts.map((post, index) => {
            return (
              <React.Fragment key={post.id}>
                {/* 1. The Post itself */}
                <PostCard post={post} />

                {/* 2. Friend Recommendation after post #2 (index 1) */}
                {index === 1 && <FeedSuggestions />}

                {/* 3. Sponsored AdCard after post #3 (index 2) */}
                {index === 2 && ads[0] && <AdCard ad={ads[0]} />}

                {/* 4. Additional Ads after post #5 if available */}
                {index === 4 && ads[1] && <AdCard ad={ads[1]} />}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            {t('feed.noPosts')}
          </p>
        </div>
      )}
    </div>
  );
}
