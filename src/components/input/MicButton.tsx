'use client';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { cn } from '@/lib/utils';

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const { isRecording, transcript, startRecording, stopRecording } = useVoice();

  const toggleMic = () => {
    if (isRecording) {
      stopRecording();
      if (transcript) onTranscript(transcript);
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMic}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
        isRecording
          ? 'mic-recording'
          : 'text-text-muted hover:text-text-primary hover:bg-white/5'
      )}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? (
        <>
          <MicOff size={16} className="text-error relative z-10" />
          <span className="absolute inset-0 rounded-lg mic-ripple" />
        </>
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
}
