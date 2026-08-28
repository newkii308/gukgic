'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Shield,
  Bell,
  Sun,
  Moon,
  Laptop,
  Languages,
  KeyRound,
  Info,
  ChevronRight,
  Trash2,
  Lock,
  UserX,
  Check,
  FileText,
  HelpCircle,
  Settings as SettingsIcon,
  AlertCircle,
  X
} from 'lucide-react';
import { LanguageCode, ThemeMode, User as UserType } from '@/types';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const { user, logout, updateProfile } = useAuth();

  const [activeCategory, setActiveCategory] = useState<
    'appearance' | 'language' | 'account' | 'privacy' | 'notifications' | 'security' | 'about'
  >('appearance');

  // Account Settings state
  const [name, setName] = useState(user?.name || '');
  const [accountSaved, setAccountSaved] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete Account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Privacy Settings state
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>(
    user?.settings?.profileVisibility || 'public'
  );
  const [postVisibility, setPostVisibility] = useState<'public' | 'friends' | 'private'>(
    user?.settings?.postVisibility || 'public'
  );
  const [whoCanSendRequests, setWhoCanSendRequests] = useState<'everyone' | 'friends_of_friends' | 'none'>(
    user?.settings?.whoCanSendRequests || 'everyone'
  );
  const [blockedUsers, setBlockedUsers] = useState<UserType[]>([]);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Notification toggles
  const [pushEnabled, setPushEnabled] = useState(user?.settings?.pushNotifications ?? true);
  const [messageNotifs, setMessageNotifs] = useState(user?.settings?.messageNotifications ?? true);
  const [socialNotifs, setSocialNotifs] = useState(user?.settings?.socialNotifications ?? true);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    if (activeCategory === 'privacy') {
      fetchBlockedUsers();
    }
  }, [activeCategory]);

  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch('/api/friends/blocked');
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data.blocked || []);
      }
    } catch {
      //
    }
  };

  const handleUnblock = async (blockedId: string) => {
    try {
      await fetch('/api/moderation/block', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: blockedId }),
      });
      setBlockedUsers((prev) => prev.filter((u) => u.id !== blockedId));
    } catch {
      //
    }
  };

  const handleSaveAccount = async () => {
    if (!name.trim()) return;
    await updateProfile({ name: name.trim() });
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ ແລະ ລະຫັດຜ່ານໃໝ່');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('ລະຫັດຜ່ານຢືນຢັນບໍ່ກົງກັນ (Passwords do not match)');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess('ປ່ຽນລະຫັດຜ່ານສຳເລັດແລ້ວ (Password updated)');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Error changing password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('ກະລຸນາປ້ອນລະຫັດຜ່ານເພື່ອຢືນຢັນ');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      await logout();
      router.push('/login');
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSavePrivacy = async () => {
    await updateProfile({
      settings: {
        profileVisibility,
        postVisibility,
        whoCanSendRequests,
        pushNotifications: pushEnabled,
        messageNotifications: messageNotifs,
        socialNotifications: socialNotifs,
      },
    });
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2500);
  };

  const categories = [
    { id: 'appearance' as const, label: 'Appearance', icon: Sun, desc: 'Themes & Visuals' },
    { id: 'language' as const, label: 'Language', icon: Languages, desc: 'Lao, English, etc.' },
    { id: 'account' as const, label: 'Account', icon: User, desc: 'Name, Profile & Password' },
    { id: 'privacy' as const, label: 'Privacy', icon: Lock, desc: 'Visibility & Blocked users' },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, desc: 'Push & Social alerts' },
    { id: 'security' as const, label: 'Security', icon: Shield, desc: 'Active session info' },
    { id: 'about' as const, label: 'About', icon: Info, desc: 'Terms, Guidelines & Version' },
  ];

  const themeOptions: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: 'light', label: t('settings.light'), icon: Sun },
    { mode: 'dark', label: t('settings.dark'), icon: Moon },
    { mode: 'system', label: t('settings.system'), icon: Laptop },
  ];

  const langOptions: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'lo', label: 'ລາວ (Lao)', flag: '🇱🇦' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary-500" />
            <span>{t('settings.title')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your preferences, privacy, and account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Categories Nav */}
        <div className="md:col-span-4 space-y-1.5 select-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all',
                  isActive
                    ? 'bg-white dark:bg-dark-card border border-primary-500/30 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-dark-card/60 text-slate-700 dark:text-slate-300'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                      isActive
                        ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                        : 'bg-slate-100 dark:bg-dark-elevated text-slate-500'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{cat.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{cat.desc}</p>
                  </div>
                </div>
                <ChevronRight className={cn('w-4 h-4 text-slate-400', isActive && 'text-primary-600')} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Settings Panel */}
        <div className="md:col-span-8 space-y-4">
          {/* 1. Appearance Settings */}
          {activeCategory === 'appearance' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t('settings.appearance')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Choose your preferred application theme</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      onClick={() => setTheme(opt.mode)}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-2xl border text-xs font-semibold gap-2 transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-elevated text-slate-600 dark:text-slate-300'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Language Settings */}
          {activeCategory === 'language' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary-500" />
                  <span>{t('settings.language')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select interface language for GUKGIC</p>
              </div>

              <div className="space-y-1.5 pt-1">
                {langOptions.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => setLanguage(opt.code)}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl text-sm transition-all',
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800/50'
                          : 'hover:bg-slate-50 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.flag}</span>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Account Settings */}
          {activeCategory === 'account' && (
            <div className="space-y-4">
              {/* Profile Details */}
              <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                    <User className="w-4 h-4 text-primary-500" />
                    <span>Account Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your personal details and display name</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Display Name
                    </label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Username
                    </label>
                    <Input value={user?.username || ''} disabled className="opacity-60 cursor-not-allowed" />
                    <span className="text-[10px] text-slate-400">Username cannot be changed</span>
                  </div>

                  <div className="pt-2">
                    <Button onClick={handleSaveAccount} size="sm" className="rounded-xl px-5">
                      {accountSaved ? <Check className="w-4 h-4 mr-1 text-emerald-300" /> : null}
                      <span>{accountSaved ? 'Saved!' : 'Save Account'}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary-500" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Update your password to keep your account secure</p>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      New Password (min 6 characters)
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword}
                      size="sm"
                      className="rounded-xl px-5"
                    >
                      <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                    </Button>
                  </div>
                </form>
              </div>

              {/* Danger Zone: Real Delete Account Modal Trigger */}
              <div className="rounded-3xl bg-white dark:bg-dark-card border border-red-200/60 dark:border-red-950/60 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Danger Zone</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Permanently delete your account and all associated posts, comments, and messages. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* 4. Privacy Settings */}
          {activeCategory === 'privacy' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span>Privacy & Visibility</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Control who can see your content and connect with you</p>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Profile Visibility
                  </label>
                  <select
                    value={profileVisibility}
                    onChange={(e: any) => setProfileVisibility(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-dark-elevated text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="public">Public (Everyone can see profile)</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Who can send you Friend Requests?
                  </label>
                  <select
                    value={whoCanSendRequests}
                    onChange={(e: any) => setWhoCanSendRequests(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-dark-elevated text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="everyone">Everyone on GUKGIC</option>
                    <option value="friends_of_friends">Friends of Friends</option>
                    <option value="none">No one</option>
                  </select>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSavePrivacy} size="sm" className="rounded-xl px-5">
                    {privacySaved ? <Check className="w-4 h-4 mr-1 text-emerald-300" /> : null}
                    <span>{privacySaved ? 'Saved!' : 'Save Privacy'}</span>
                  </Button>
                </div>

                {/* Blocked Users Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-dark-text flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Blocked Users</span>
                  </h4>
                  {blockedUsers.length > 0 ? (
                    <div className="space-y-2">
                      {blockedUsers.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-dark-elevated"
                        >
                          <span className="text-xs font-semibold">{b.name} (@{b.username})</span>
                          <button
                            onClick={() => handleUnblock(b.id)}
                            className="text-xs text-primary-600 hover:underline font-bold"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No blocked users</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. Notifications Settings */}
          {activeCategory === 'notifications' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary-500" />
                  <span>Notification Preferences</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize when and how you receive alerts</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-dark-text">Push Notifications</p>
                    <p className="text-[11px] text-slate-400">Receive alerts on device</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-dark-text">Message Notifications</p>
                    <p className="text-[11px] text-slate-400">Alerts for new direct messages</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={messageNotifs}
                    onChange={(e) => setMessageNotifs(e.target.checked)}
                    className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-dark-text">Social Notifications</p>
                    <p className="text-[11px] text-slate-400">Alerts for friend requests, likes, comments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={socialNotifs}
                    onChange={(e) => setSocialNotifs(e.target.checked)}
                    className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Security Settings */}
          {activeCategory === 'security' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  <span>Security & Sessions</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage session tokens and device logins</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-dark-elevated space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-dark-text">Current Active Session</span>
                    <Badge variant="success" size="sm">Online</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">Authenticated via Secure HTTP-only JWT Cookie</p>
                </div>
              </div>
            </div>
          )}

          {/* 7. About & Legal Settings */}
          {activeCategory === 'about' && (
            <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary-500" />
                  <span>About GUKGIC</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Community standards and application info</p>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/terms"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-500" />
                    <span>Terms of Service</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/privacy"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Privacy Policy</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/about"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-dark-elevated hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>Community Guidelines</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <div className="p-3 text-center text-xs text-slate-400 pt-3">
                  <p className="font-bold text-slate-700 dark:text-slate-300">GUKGIC Social Platform</p>
                  <p className="text-[11px] mt-0.5">Version 1.0.0 (Production Persistence Architecture)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-dark-muted">
              Are you sure you want to delete your account? All your posts, messages, friendships, and profile data will be permanently wiped.
            </p>

            {deleteError && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Enter your password to confirm:
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="rounded-xl text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
