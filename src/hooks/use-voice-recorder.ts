'use client';

import { useState, useRef, useCallback } from 'react';

export interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number; // in seconds
  base64: string;
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioResult, setAudioResult] = useState<VoiceRecording | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioResult(null);
      audioChunksRef.current = [];

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const finalDuration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioResult({
            blob: audioBlob,
            url: audioUrl,
            duration: finalDuration,
            base64: base64data,
          });
        };

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setError(err.message || 'Microphone access denied');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback((): Promise<VoiceRecording | null> => {
    return new Promise((resolve) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = async () => {
          if (audioChunksRef.current.length === 0) {
            setIsRecording(false);
            resolve(null);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const finalDuration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            const res: VoiceRecording = {
              blob: audioBlob,
              url: audioUrl,
              duration: finalDuration,
              base64: base64data,
            };
            setAudioResult(res);
            setIsRecording(false);
            resolve(res);
          };
        };
        mediaRecorderRef.current.stop();
      } else {
        setIsRecording(false);
        resolve(null);
      }
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setAudioResult(null);
    setRecordingDuration(0);
    setError(null);
  }, []);

  return {
    isRecording,
    recordingDuration,
    audioResult,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    setAudioResult,
  };
}
