'use client';
import { ModeSelector } from './ModeSelector';

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between px-6 h-12 border-b border-border-subtle bg-bg-base/60 backdrop-blur-xl shrink-0 relative z-20">
      <div className="flex-1" />
      <ModeSelector />
      <div className="flex-1" />
    </header>
  );
}
