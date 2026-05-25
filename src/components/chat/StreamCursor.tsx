'use client';
import { motion } from 'framer-motion';

export function StreamCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-block w-[2px] h-4 bg-accent-primary ml-0.5 align-middle"
    />
  );
}
