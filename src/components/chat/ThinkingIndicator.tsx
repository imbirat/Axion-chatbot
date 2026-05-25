'use client';
import { motion } from 'framer-motion';

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 glass-surface w-fit">
      <span className="text-xs font-medium text-text-secondary">Axion is thinking</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent-primary"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </div>
  );
}
