'use client';
import { motion } from 'framer-motion';
import { FileText, BarChart, Code, Globe, Plane, PenLine } from 'lucide-react';

const starters = [
  { icon: <FileText size={18} />, label: 'Write a story', desc: 'Draft a narrative or creative text.' },
  { icon: <BarChart size={18} />, label: 'Analyze data', desc: 'Process and summarize datasets.' },
  { icon: <Plane size={18} />, label: 'Plan a trip', desc: 'Create an itinerary and suggest spots.' },
  { icon: <Code size={18} />, label: 'Help me code', desc: 'Write, debug, or explain code blocks.' },
];

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto flex justify-center w-full pt-24 pb-32">
      <div className="w-full max-w-[800px] px-6 flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <h1 className="text-[40px] font-bold text-accent-primary mb-4 opacity-90 tracking-tighter leading-[48px]">
            AXION
          </h1>
          <p className="text-lg text-text-secondary max-w-lg text-center">
            How can I help you today?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
        >
          {starters.map((starter) => (
            <button
              key={starter.label}
              onClick={() => onSelectPrompt(starter.label)}
              className="flex items-start gap-4 p-4 border border-border-subtle rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded bg-[var(--hover-bg)] flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-colors">
                {starter.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-0.5">{starter.label}</h3>
                <p className="text-sm text-text-muted">{starter.desc}</p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
