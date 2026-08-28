'use client';

import React from 'react';
import { useVoiceRecorder, VoiceRecording } from '@/hooks/use-voice-recorder';
import { useI18n } from '@/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/utils';
import { Mic, Square, Trash2, Send, Play } from 'lucide-react';

interface VoiceRecorderProps {
  onSendVoice: (recording: VoiceRecording) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSendVoice,
  onCancel,
}) => {
  const { t } = useI18n();
  const {
    isRecording,
    recordingDuration,
    audioResult,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  React.useEffect(() => {
    startRecording();
    return () => {
      cancelRecording();
    };
  }, []);

  const handleStopAndPreview = async () => {
    await stopRecording();
  };

  const handleSend = () => {
    if (audioResult) {
      onSendVoice(audioResult);
    }
  };

  const handleCancelAll = () => {
    cancelRecording();
    onCancel();
  };

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-primary-50 dark:bg-dark-elevated border border-primary-200 dark:border-primary-900/50 animate-scale-up w-full">
      {/* Left: Recording state & timer */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
          <span className="w-3 h-3 rounded-full bg-rose-500 relative" />
        </div>

        <span className="text-xs font-mono font-bold text-slate-800 dark:text-dark-text">
          {formatDuration(audioResult ? audioResult.duration : recordingDuration)}
        </span>

        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
          {isRecording ? t('chat.recording') : 'Preview Ready'}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Cancel button */}
        <button
          onClick={handleCancelAll}
          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-dark-card transition-colors"
          title={t('chat.cancelVoice')}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {isRecording ? (
          <Button
            size="sm"
            onClick={handleStopAndPreview}
            className="rounded-xl px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs h-8"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{t('chat.stopRecording')}</span>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSend}
            className="rounded-xl px-4 bg-primary-600 hover:bg-primary-700 text-white text-xs h-8 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('chat.sendVoice')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
