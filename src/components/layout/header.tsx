'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Search,
  Moon,
  Sun,
  Laptop,
  Languages,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { LanguageCode, ThemeMode } from '@/types';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, switchDemoUser } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const langLabels: Record<LanguageCode, { label: string; flag: string }> = {
    lo: { label: 'ລາວ (Lao)', flag: '🇱🇦' },
    en: { label: 'English', flag: '🇺🇸' },
    th: { label: 'ไทย (Thai)', flag: '🇹🇭' },
    zh: { label: '中文 (Chinese)', flag: '🇨🇳' },
    vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
  };

  const demoUsers = [
    { id: 'user_me', name: 'Khampheng (You)', role: 'Vientiane' },
    { id: 'user_1', name: 'Alouny Souvannavong', role: 'Vientiane' },
    { id: 'user_2', name: 'Khamla Phommachan', role: 'Luang Prabang' },
    { id: 'user_3', name: 'Souphaphone Keomany', role: 'Vientiane' },
    { id: 'user_5', name: 'Vilaphone Saysana', role: 'Savannakhet' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-dark-bg/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-indigo-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Friend <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold border border-primary-500/20">LA</span>
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Tablet/Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-dark-card border border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-sm text-left"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>{t('app.search')}</span>
            <kbd className="ml-auto text-[10px] bg-white dark:bg-dark-elevated px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSearch}
            className="md:hidden text-slate-600 dark:text-slate-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Switch Demo User Fast Pill */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="text-xs hidden sm:flex items-center gap-1.5 py-1 px-2.5 h-8 border-primary-500/30 text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Demo Users</span>
            </Button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-scale-up">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Account
                </div>
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchDemoUser(u.id);
                      setDemoMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-colors ${
                      user?.id === u.id
                        ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="text-[10px] text-slate-400">{u.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
              aria-label="Change Language"
            >
              <Languages className="w-5 h-5" />
            </Button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-scale-up">
                {(Object.keys(langLabels) as LanguageCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLanguage(code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2.5 transition-colors ${
                      language === code
                        ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base">{langLabels[code].flag}</span>
                    <span>{langLabels[code].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </Button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-scale-up">
                <button
                  onClick={() => {
                    setTheme('light');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors ${
                    theme === 'light'
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t('settings.light')}</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>{t('settings.dark')}</span>
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors ${
                    theme === 'system'
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <span>{t('settings.system')}</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link */}
          {user && (
            <Link href="/profile" className="ml-1 select-none">
              <Avatar
                src={user.avatar}
                fallbackName={user.name}
                size="sm"
                isOnline={user.isOnline}
                showOnlineStatus
                className="hover:ring-2 hover:ring-primary-500 transition-all"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
