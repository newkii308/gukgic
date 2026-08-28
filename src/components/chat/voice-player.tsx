'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { formatDuration, cn } from '@/lib/utils';

interface VoicePlayerProps {
  mediaUrl?: string;
  duration?: number;
  isSender?: boolean;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  mediaUrl,
  duration = 8,
  isSender = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate deterministic wave heights
  const bars = [25, 45, 80, 60, 95, 40, 70, 30, 85, 55, 90, 45, 65, 35, 75, 50];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.25;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (audioRef.current && mediaUrl && (mediaUrl.startsWith('/uploads') || mediaUrl.startsWith('http') || mediaUrl.startsWith('blob:'))) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        if (currentTime >= duration) setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  };

  const progressPercent = Math.min(100, (currentTime / (duration || 1)) * 100);

  return (
    <div className="flex items-center gap-2.5 py-1 min-w-[190px] max-w-[240px]">
      {mediaUrl && (
        <audio
          ref={audioRef}
          src={mediaUrl}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 active:scale-90',
          isSender
            ? 'bg-white text-primary-600 shadow-sm'
            : 'bg-primary-600 text-white shadow-sm shadow-primary-500/20'
        )}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Visualization Bars */}
      <div className="flex-1 flex items-center gap-[2.5px] h-6 cursor-pointer" onClick={togglePlay}>
        {bars.map((height, idx) => {
          const barProgress = (idx / bars.length) * 100;
          const isPassed = barProgress <= progressPercent;

          return (
            <div
              key={idx}
              className={cn(
                'w-1 rounded-full transition-all duration-150',
                isSender
                  ? isPassed ? 'bg-white' : 'bg-white/40'
                  : isPassed ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
              )}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Duration Label */}
      <span
        className={cn(
          'text-[11px] font-mono font-medium flex-shrink-0 select-none',
          isSender ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
        )}
      >
        {formatDuration(isPlaying ? Math.floor(currentTime) : duration)}
      </span>
    </div>
  );
};
