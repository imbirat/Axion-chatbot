'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
  onClick: () => void;
}

export function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      onClick={onClick}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-text-secondary hover:text-text-primary z-40 transition-colors"
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <ChevronDown size={13} />
      Scroll to bottom
    </motion.button>
  );
}
