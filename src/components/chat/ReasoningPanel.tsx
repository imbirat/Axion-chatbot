'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { StreamCursor } from './StreamCursor';

interface ReasoningPanelProps {
  content: string;
  isStreaming: boolean;
}

export function ReasoningPanel({ content, isStreaming }: ReasoningPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mb-4 rounded-xl overflow-hidden"
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors hover:bg-[var(--hover-bg)]"
      >
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: 'var(--color-accent-primary)',
                boxShadow: '0 0 0 3px rgba(207,116,85,0.2)',
                animation: 'pulse-dot 1.5s ease infinite',
              }}
            />
          ) : (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: 'var(--color-text-muted)', opacity: 0.5 }}
            />
          )}
          <span className="text-[12px] font-medium text-text-secondary">
            {isStreaming ? 'Thinking…' : 'Thought process'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.18 }}
        >
          <ChevronRight size={13} className="text-text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ borderTop: '1px solid var(--color-border-subtle)' }}
          >
            <div className="px-4 py-3 max-h-48 overflow-y-auto">
              <p className="font-mono text-[12px] text-text-muted whitespace-pre-wrap leading-relaxed">
                {content}
                {isStreaming && <StreamCursor />}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
