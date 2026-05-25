'use client';
import { Menu } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import { useSettingsStore } from '@/store/settingsStore';

export function ChatHeader() {
  const { toggleMobileSidebar } = useSettingsStore();

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-12 shrink-0 relative z-20"
      style={{
        background: 'var(--color-bg-base)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden w-8 h-8 rounded-xl hover:bg-[var(--hover-bg)] flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          title="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <div
          className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #CF7455 0%, #E8956A 100%)' }}
        >
          <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
            <path d="M4 14 L9 4 L14 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 10.5 H12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <ModeSelector />
      </div>

      <div className="flex-1" />
    </header>
  );
}
