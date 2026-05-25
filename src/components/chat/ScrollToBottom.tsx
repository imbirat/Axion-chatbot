'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
  onClick: () => void;
}

export function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onClick={onClick}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 glass-surface text-xs text-text-secondary hover:text-text-primary z-40"
    >
      <ChevronDown size={14} />
      Scroll to bottom
    </motion.button>
  );
}
