'use client';
import { ModeSelector } from './ModeSelector';

export function ChatHeader() {
  return (
    <header className="flex items-center justify-center px-6 h-14 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md shrink-0">
      <nav className="md:flex items-center gap-8">
        <ModeSelector />
      </nav>
    </header>
  );
}
