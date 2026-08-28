'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { FriendCard } from './friend-card';
import { useI18n } from '@/hooks/use-i18n';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Sparkles, Filter, Compass } from 'lucide-react';

export const DiscoverSection: React.FC = () => {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedInterest, setSelectedInterest] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cityOptions = [
    { label: t('friends.filterAll'), value: 'All' },
    { label: t('friends.filterVientiane'), value: 'Vientiane' },
    { label: t('friends.filterLuangPrabang'), value: 'Luang Prabang' },
    { label: t('friends.filterChampasak'), value: 'Champasak' },
    { label: t('friends.filterSavannakhet'), value: 'Savannakhet' },
  ];

  const interestOptions = [
    'All',
    'Photography',
    'Coffee',
    'Gaming',
    'Tech',
    'Music',
    'Travel',
    'Fashion',
    'Cycling',
    'Camping',
  ];

  useEffect(() => {
    fetchDiscoverUsers();
  }, [selectedCity, selectedInterest, searchQuery]);

  const fetchDiscoverUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== 'All') params.set('city', selectedCity);
      if (selectedInterest !== 'All') params.set('interest', selectedInterest);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/friends/discover?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm space-y-4">
        <Input
          placeholder={t('friends.findFriends')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        {/* City Filter Pills */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span>{t('friends.sameCity')}</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {cityOptions.map((city) => (
              <button
                key={city.value}
                onClick={() => setSelectedCity(city.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCity === city.value
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
                    : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Filter Tags */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('friends.sameInterests')}</span>
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => setSelectedInterest(interest)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedInterest === interest
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {interest === 'All' ? t('friends.filterAll') : interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-dark-text mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary-500" />
          <span>{t('friends.peopleYouMayKnow')} ({users.length})</span>
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            {t('app.loading')}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <FriendCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-3xl bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/80 p-6 space-y-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {t('friends.noFriends')}
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your city or interest filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
