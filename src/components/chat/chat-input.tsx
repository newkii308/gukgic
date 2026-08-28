'use client';

import React, { useState, useRef } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { VoiceRecorder } from './voice-recorder';
import { VoiceRecording } from '@/hooks/use-voice-recorder';
import { Button } from '@/components/ui/button';
import { NativeCamera } from '@/lib/capacitor';
import {
  Mic,
  Image as ImageIcon,
  Send,
  X,
  Smile,
  CornerUpLeft
} from 'lucide-react';
import { Message } from '@/types';

interface ChatInputProps {
  onSendMessage: (params: {
    content: string;
    type?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
    duration?: number;
    replyTo?: { id: string; senderName: string; content: string };
  }) => void;
  onTyping?: (isTyping: boolean) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  replyingTo,
  onCancelReply,
}) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const quickEmojis = ['❤️', '😂', '🇱🇦', '✨', '☕', '👍', '🔥', '🙏'];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    onSendMessage({
      content: text.trim(),
      type: 'text',
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.sender.name,
            content: replyingTo.content.substring(0, 50),
          }
        : undefined,
    });

    setText('');
    if (onCancelReply) onCancelReply();
    if (onTyping) onTyping(false);
  };

  const handleSendVoice = (recording: VoiceRecording) => {
    onSendMessage({
      content: t('chat.voiceMessage'),
      type: 'voice',
      mediaUrl: recording.url || recording.base64,
      duration: recording.duration,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.sender.name,
            content: replyingTo.content.substring(0, 50),
          }
        : undefined,
    });
    setIsRecordingMode(false);
    if (onCancelReply) onCancelReply();
  };

  const handlePickImage = async () => {
    const res = await NativeCamera.pickImage();
    if (res?.dataUrl) {
      onSendMessage({
        content: t('chat.imageMessage'),
        type: 'image',
        mediaUrl: res.dataUrl,
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              senderName: replyingTo.sender.name,
              content: replyingTo.content.substring(0, 50),
            }
          : undefined,
      });
      if (onCancelReply) onCancelReply();
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div className="p-3 bg-white dark:bg-dark-card border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
      {/* Reply Preview Bar */}
      {replyingTo && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-elevated text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <CornerUpLeft className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="font-bold">{replyingTo.sender.name}:</span>
            <span className="truncate">{replyingTo.content}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recording Mode Bar */}
      {isRecordingMode ? (
        <VoiceRecorder
          onSendVoice={handleSendVoice}
          onCancel={() => setIsRecordingMode(false)}
        />
      ) : (
        <form onSubmit={handleSendText} className="flex items-center gap-2">
          {/* Pick Image */}
          <button
            type="button"
            onClick={handlePickImage}
            className="p-2 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors flex-shrink-0"
            title={t('feed.photo')}
          >
            <ImageIcon className="w-5 h-5 text-emerald-500" />
          </button>

          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-elevated transition-colors flex-shrink-0"
          >
            <Smile className="w-5 h-5 text-amber-500" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder={t('chat.typeMessage')}
              className="w-full h-11 px-4 rounded-2xl bg-slate-100 dark:bg-dark-elevated text-sm text-slate-900 dark:text-dark-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-transparent dark:border-slate-800 transition-all"
            />
          </div>

          {/* Voice Record or Send Button */}
          {text.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="rounded-2xl w-11 h-11 bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setIsRecordingMode(true)}
              className="rounded-2xl w-11 h-11 text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex-shrink-0"
              title={t('chat.pressToRecord')}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </form>
      )}

      {/* Quick Emoji Bar */}
      {showEmojiPicker && !isRecordingMode && (
        <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="text-lg p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-elevated hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
