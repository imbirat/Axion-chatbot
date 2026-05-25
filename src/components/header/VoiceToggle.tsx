'use client';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { cn } from '@/lib/utils';

export function VoiceToggle() {
  const { isRecording, startRecording, stopRecording } = useVoice();

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
        isRecording
          ? 'mic-recording'
          : 'text-text-muted hover:text-text-primary hover:bg-[var(--hover-bg)]'
      )}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? (
        <>
          <MicOff size={16} className="text-error relative z-10" />
          <span className="absolute inset-0 rounded-lg mic-ripple" />
          <span className="absolute inset-0 rounded-lg mic-ripple" style={{ animationDelay: '0.5s' }} />
        </>
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
}
