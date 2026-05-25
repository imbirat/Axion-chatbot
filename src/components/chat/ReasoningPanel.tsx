'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Brain } from 'lucide-react';
import { StreamCursor } from './StreamCursor';
import { cn } from '@/lib/utils';

interface ReasoningPanelProps {
  content: string;
  isStreaming: boolean;
}

export function ReasoningPanel({ content, isStreaming }: ReasoningPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-surface mb-3 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-[var(--hover-bg)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-accent-secondary" />
          <span className="text-xs font-medium text-text-secondary">Reasoning process</span>
          {isStreaming && (
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          )}
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="border-t border-border-subtle"
          >
            <div className="px-4 py-3">
              <p className="font-mono text-xs text-text-secondary/70 whitespace-pre-wrap leading-relaxed">
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
