'use client';
import { motion } from 'framer-motion';
import { MessageSquare, Code, Search } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { Mode } from '@/types/chat';
import { cn } from '@/lib/utils';

const modes: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={14} /> },
  { id: 'code', label: 'Code', icon: <Code size={14} /> },
  { id: 'research', label: 'DeepResearch', icon: <Search size={14} /> },
];

export function ModeSelector() {
  const { mode, setMode } = useChatStore();

  return (
    <div className="flex items-center gap-1 bg-bg-elevated/30 rounded-xl p-1 border border-border-subtle relative">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={cn(
            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 z-10',
            mode === m.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
          {mode === m.id && (
            <motion.div
              layoutId="mode-indicator"
              className="absolute inset-0 rounded-lg bg-accent-primary/20 border border-accent-primary/30"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
