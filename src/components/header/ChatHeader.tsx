'use client';
import { Menu } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import { useSettingsStore } from '@/store/settingsStore';

export function ChatHeader() {
  const { toggleMobileSidebar } = useSettingsStore();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-12 border-b border-border-subtle bg-bg-base/60 backdrop-blur-xl shrink-0 relative z-20">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden w-8 h-8 rounded-xl hover:bg-[var(--hover-bg)] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          title="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="md:hidden w-7 h-7 rounded-lg bg-accent-primary flex items-center justify-center font-bold text-white text-xs">
          A
        </div>
      </div>
      <ModeSelector />
      <div className="flex-1" />
    </header>
  );
}
