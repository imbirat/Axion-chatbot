'use client';
import { ModelSelector } from './ModelSelector';
import { ModeSelector } from './ModeSelector';
import { VoiceToggle } from './VoiceToggle';
import { useChatStore } from '@/store/chatStore';

export function ChatHeader() {
  const { isStreaming } = useChatStore();

  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-border-subtle bg-bg-surface/50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <ModeSelector />
      </div>
      <div className="flex items-center gap-3">
        <ModelSelector />
        {!isStreaming && <VoiceToggle />}
      </div>
    </header>
  );
}
