'use client';
import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SendButtonProps {
  disabled?: boolean;
  isStreaming?: boolean;
  onStop?: () => void;
}

export function SendButton({ disabled, isStreaming, onStop }: SendButtonProps) {
  if (isStreaming) {
    return (
      <button
        type="button"
        onClick={onStop}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors shrink-0"
        title="Stop generation"
      >
        <Square size={16} fill="currentColor" />
      </button>
    );
  }

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 shrink-0',
        disabled
          ? 'bg-bg-elevated text-text-muted cursor-not-allowed'
          : 'bg-accent-primary text-white hover:bg-accent-primary/90'
      )}
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}
