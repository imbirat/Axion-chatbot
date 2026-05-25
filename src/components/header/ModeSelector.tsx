'use client';
import { motion } from 'framer-motion';
import { MessageSquare, Code, Search } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Mode } from '@/types/chat';
import { cn } from '@/lib/utils';

const modes: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={13} /> },
  { id: 'code', label: 'Code', icon: <Code size={13} /> },
  { id: 'research', label: 'Research', icon: <Search size={13} /> },
];

export function ModeSelector() {
  const { mode, setMode } = useChatStore();

  return (
    <div className="flex items-center gap-1 bg-bg-elevated/40 rounded-lg p-0.5 border border-border-subtle">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 z-10',
            mode === m.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {m.icon}
          <span>{m.label}</span>
          {mode === m.id && (
            <motion.div
              layoutId="mode-indicator-v2"
              className="absolute inset-0 rounded-md bg-accent-primary/10 border border-accent-primary/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
