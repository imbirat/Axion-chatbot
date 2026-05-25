'use client';
import { motion } from 'framer-motion';
import { MessageSquare, Code, Search } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Mode } from '@/types/chat';
import { cn } from '@/lib/utils';

const modes: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'chat',     label: 'Chat',     icon: <MessageSquare size={12} /> },
  { id: 'code',     label: 'Code',     icon: <Code size={12} /> },
  { id: 'research', label: 'Research', icon: <Search size={12} /> },
];

export function ModeSelector() {
  const { mode, setMode } = useChatStore();

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-xl"
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition-all duration-200 z-10',
            mode === m.id
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {m.icon}
          <span>{m.label}</span>
          {mode === m.id && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 rounded-[10px]"
              style={{
                background: 'var(--color-bg-base)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid var(--color-border-subtle)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
