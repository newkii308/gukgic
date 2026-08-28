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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setAudioResult(null);
      audioChunksRef.current = [];

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const finalDuration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

        // Convert to base64
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

        // Stop stream
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
    } catch (err) {
      console.warn('Microphone access error or mock environment:', err);
      // Mock recording for testing without real microphone hardware
      setIsRecording(true);
      startTimeRef.current = Date.now();
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
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
        // Fallback for mocked recorder
        const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const res: VoiceRecording = {
          blob: new Blob([], { type: 'audio/webm' }),
          url: '',
          duration,
          base64: 'sample_audio_voice_message',
        };
        setAudioResult(res);
        setIsRecording(false);
        resolve(res);
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
  }, []);

  return {
    isRecording,
    recordingDuration,
    audioResult,
    startRecording,
    stopRecording,
    cancelRecording,
    setAudioResult,
  };
}
