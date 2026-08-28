'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '@/types';
import lo from '@/i18n/lo.json';
import en from '@/i18n/en.json';
import th from '@/i18n/th.json';
import zh from '@/i18n/zh.json';
import vi from '@/i18n/vi.json';

const translations: Record<LanguageCode, any> = { lo, en, th, zh, vi };

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'lo',
  setLanguage: () => {},
  t: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('lo');

  useEffect(() => {
    const saved = localStorage.getItem('friend_lang') as LanguageCode;
    if (saved && ['lo', 'en', 'th', 'zh', 'vi'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('friend_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to Lao or English
        let fallback = translations['lo'];
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey];
          } else {
            fallback = null;
            break;
          }
        }
        value = fallback || path;
        break;
      }
    }

    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }, value);
    }

    return typeof value === 'string' ? value : path;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
