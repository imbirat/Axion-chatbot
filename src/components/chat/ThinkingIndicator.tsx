'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';

const stages = [
  { label: 'Thinking', emoji: '' },
  { label: 'Processing', emoji: '' },
  { label: 'Reasoning', emoji: '' },
  { label: 'Formulating', emoji: '' },
];

export function ThinkingIndicator() {
  const [stageIndex, setStageIndex] = useState(0);
  const mode = useChatStore((s) => s.mode);

  useEffect(() => {
    if (mode === 'research') {
      const researchStages = [
        { label: 'Searching', emoji: '' },
        { label: 'Analyzing', emoji: '' },
        { label: 'Synthesizing', emoji: '' },
        { label: 'Formulating', emoji: '' },
      ];
      setStageIndex(0);
      const interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % researchStages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mode]);

  const currentStages = mode === 'research'
    ? [
        { label: 'Searching', emoji: '' },
        { label: 'Analyzing', emoji: '' },
        { label: 'Synthesizing', emoji: '' },
        { label: 'Formulating', emoji: '' },
      ]
    : stages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 px-4 py-3"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent-primary"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <span className="text-xs font-medium shimmer-text">
          Axion is {currentStages[stageIndex].label.toLowerCase()}
        </span>
        <span className="text-xs text-text-muted/40 font-mono tabular-nums">
          {stageIndex + 1}/{currentStages.length}
        </span>
      </div>
    </motion.div>
  );
}
