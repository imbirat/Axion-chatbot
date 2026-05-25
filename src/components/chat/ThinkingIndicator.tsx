'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';

const chatStages   = ['Thinking', 'Processing', 'Reasoning', 'Formulating'];
const researchStages = ['Searching', 'Analyzing', 'Synthesizing', 'Formulating'];

export function ThinkingIndicator() {
  const [stageIndex, setStageIndex] = useState(0);
  const mode = useChatStore((s) => s.mode);
  const stages = mode === 'research' ? researchStages : chatStages;

  useEffect(() => {
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, mode === 'research' ? 2500 : 3000);
    return () => clearInterval(interval);
  }, [mode, stages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5 py-3 px-1"
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-accent-primary)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-[13px] text-text-muted">
        {stages[stageIndex]}…
      </span>
    </motion.div>
  );
}
