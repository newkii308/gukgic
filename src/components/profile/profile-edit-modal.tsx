'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useI18n } from '@/hooks/use-i18n';
import { NativeCamera } from '@/lib/capacitor';
import { Camera, Plus, X } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { t } = useI18n();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePickAvatar = async () => {
    const res = await NativeCamera.pickImage();
    const url = res?.uploadedUrl || res?.dataUrl;
    if (url) {
      setAvatar(url);
    }
  };

  const handlePickCover = async () => {
    const res = await NativeCamera.pickImage();
    const url = res?.uploadedUrl || res?.dataUrl;
    if (url) {
      setCoverImage(url);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests((prev) => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests((prev) => prev.filter((i) => i !== item));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar,
        coverImage,
        interests,
      });
      onClose();
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('profile.editProfile')} maxWidth="lg">
      <div className="space-y-4">
        {/* Cover Photo */}
        <div className="relative h-32 rounded-2xl bg-slate-100 dark:bg-dark-elevated overflow-hidden group">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
          <button
            onClick={handlePickCover}
            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity gap-2 text-xs font-semibold"
          >
            <Camera className="w-4 h-4" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handlePickAvatar}>
            <Avatar src={avatar} fallbackName={name} size="xl" />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-dark-text">{name}</h4>
            <p className="text-xs text-slate-400">Click avatar to upload new photo</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {t('auth.fullName')}
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {t('profile.aboutMe')}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('profile.bioPlaceholder')}
            rows={3}
            className="w-full bg-slate-50 dark:bg-dark-elevated rounded-2xl p-3 text-sm text-slate-900 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 border border-slate-200/60 dark:border-slate-800 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {t('profile.location')}
          </label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        {/* Interests */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
            {t('profile.interests')}
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {interests.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-300 border border-primary-200 dark:border-primary-800/40 font-medium"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(item)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. Photography, Coffee, Anime"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddInterest}
              className="rounded-xl px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose} size="sm">
            {t('app.cancel')}
          </Button>
          <Button onClick={handleSave} isLoading={isLoading} size="sm" className="px-6">
            {t('app.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
