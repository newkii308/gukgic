'use client';

import React from 'react';
import { Advertisement } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

interface AdCardProps {
  ad: Advertisement;
}

export const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl bg-gradient-to-b from-amber-500/5 via-slate-50 to-white dark:from-amber-500/5 dark:via-dark-card dark:to-dark-card border border-amber-500/20 dark:border-amber-500/20 p-5 shadow-sm space-y-3.5 transition-all hover:border-amber-500/40">
      {/* Ad Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {ad.sponsor}
          </span>
        </div>
        <Badge variant="ad" size="sm">
          {ad.badge || t('app.sponsored')}
        </Badge>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-dark-text">
          {ad.title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-dark-muted mt-1 leading-relaxed">
          {ad.description}
        </p>
      </div>

      {/* Ad Media */}
      {ad.imageUrl && (
        <div className="rounded-2xl overflow-hidden max-h-72 w-full bg-slate-100 dark:bg-dark-elevated">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
          />
        </div>
      )}

      {/* CTA Button */}
      <div className="pt-1 flex justify-end">
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>{ad.ctaText}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
