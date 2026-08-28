'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, FriendshipStatus } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileEditModal } from './profile-edit-modal';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import {
  MapPin,
  Languages as LangIcon,
  Calendar,
  Edit3,
  UserPlus,
  MessageCircle,
  Check,
  MoreHorizontal,
  Share2,
  Users,
  Flag
} from 'lucide-react';
import { NativeShare } from '@/lib/capacitor';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile?: boolean;
  initialFriendshipStatus?: FriendshipStatus;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = false,
  initialFriendshipStatus = 'none',
}) => {
  const { user: currentUser } = useAuth();
  const { t } = useI18n();
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(initialFriendshipStatus);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.id }),
      });
      if (res.ok) setFriendshipStatus('pending');
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareProfile = async () => {
    await NativeShare.share({
      title: `${user.name} (@${user.username}) on Friend Social App`,
      text: user.bio || `Connect with ${user.name} on Friend Social Laos`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/u/${user.username}` : '',
    });
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 overflow-hidden shadow-sm">
      {/* Cover Image */}
      <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-primary-600 via-indigo-600 to-rose-500 overflow-hidden">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Info Body */}
      <div className="px-5 pb-6 pt-0 relative">
        {/* Avatar and Top Actions Bar */}
        <div className="flex flex-wrap items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="p-1 rounded-full bg-white dark:bg-dark-card shadow-lg inline-block">
            <Avatar
              src={user.avatar}
              fallbackName={user.name}
              size="2xl"
              isOnline={user.isOnline}
              showOnlineStatus
              className="w-24 h-24 sm:w-28 sm:h-28"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            {isOwnProfile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                className="rounded-2xl"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('profile.editProfile')}</span>
              </Button>
            ) : (
              <>
                {friendshipStatus === 'none' && (
                  <Button
                    onClick={handleAddFriend}
                    isLoading={isLoading}
                    size="sm"
                    className="rounded-2xl"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t('friends.addFriend')}</span>
                  </Button>
                )}

                {friendshipStatus === 'pending' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl text-slate-600"
                    disabled
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('friends.requested')}</span>
                  </Button>
                )}

                <Link href="/messages">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl text-primary-600 dark:text-primary-400"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t('friends.message')}</span>
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareProfile}
              className="rounded-2xl text-slate-500"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Identity Details */}
        <div className="space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-dark-text">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">@{user.username}</p>
          </div>

          {user.bio && (
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}

          {/* Meta Info Badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary-500" />
                <span>{user.location}</span>
              </span>
            )}
            {user.languages && user.languages.length > 0 && (
              <span className="flex items-center gap-1">
                <LangIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>{user.languages.join(', ')}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <strong className="text-slate-800 dark:text-slate-200 font-bold">{user.friendsCount}</strong> {t('profile.friendsCount')}
            </span>
          </div>

          {/* Interests Chips */}
          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {user.interests.map((item) => (
                <Badge key={item} variant="primary" size="sm">
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};
