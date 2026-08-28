'use client';

import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/hooks/use-i18n';
import { useAuth } from '@/hooks/use-auth';
import { NativePush } from '@/lib/capacitor';
import {
  Sun,
  Moon,
  Laptop,
  Languages,
  Bell,
  Shield,
  Smartphone,
  Check,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { LanguageCode, ThemeMode } from '@/types';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const { logout } = useAuth();
  const [pushEnabled, setPushEnabled] = React.useState(false);

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

  const handleTogglePush = async () => {
    const token = await NativePush.register();
    if (token) setPushEnabled(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Title */}
      <h1 className="text-xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary-500" />
        <span>{t('settings.title')}</span>
      </h1>

      {/* 1. Theme Appearance */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
          {resolvedTheme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>{t('settings.appearance')}</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold gap-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-dark-elevated text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Language Selection */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary-500" />
          <span>{t('settings.language')}</span>
        </h3>

        <div className="space-y-1 pt-1">
          {langOptions.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm transition-all ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-dark-elevated text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{opt.flag}</span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Notifications & Capacitor Device Abstraction */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-500" />
          <span>{t('settings.notificationsSetting')}</span>
        </h3>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Push Notifications (Native / Web)
            </p>
            <p className="text-[11px] text-slate-400">
              Get notified instantly when receiving friend requests or messages
            </p>
          </div>

          <button
            onClick={handleTogglePush}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              pushEnabled ? 'bg-primary-600' : 'bg-slate-300 dark:bg-dark-elevated'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                pushEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. About App & Version */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-5 shadow-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-primary-500" />
          <span>{t('settings.aboutApp')}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Friend Social App — Next.js 14 App Router + Capacitor Bridge Architecture. Designed specifically for Lao Gen Z with natural Lao localization, high-performance real-time messaging, voice notes, and ad-readiness.
        </p>
        <p className="text-[11px] font-mono text-primary-600 dark:text-primary-400 pt-1">
          {t('settings.version')}
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 text-sm font-bold transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('nav.logout')}</span>
      </button>
    </div>
  );
}
