'use client';
import { motion } from 'framer-motion';
import { FileText, BarChart, Globe, Code, Bug, Mountain } from 'lucide-react';

const starters = [
  { icon: <FileText size={18} />, label: 'Write', desc: 'Draft content or stories', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
  { icon: <Code size={18} />, label: 'Code', desc: 'Build and debug software', color: 'from-green-500/20 to-green-600/20 border-green-500/30' },
  { icon: <BarChart size={18} />, label: 'Analyze', desc: 'Process data and insights', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30' },
  { icon: <Bug size={18} />, label: 'Debug', desc: 'Find and fix issues', color: 'from-red-500/20 to-red-600/20 border-red-500/30' },
  { icon: <Globe size={18} />, label: 'Research', desc: 'Deep-dive into topics', color: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30' },
  { icon: <Mountain size={18} />, label: 'Plan', desc: 'Strategize and organize', color: 'from-amber-500/20 to-amber-600/20 border-amber-500/30' },
];

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg shadow-accent-primary/20"
      >
        A
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.3 }}
        className="text-2xl font-semibold text-text-primary mb-2 tracking-tight"
      >
        What can I help you with?
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.3 }}
        className="text-sm text-text-muted mb-10"
      >
        Choose a task or type your own
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-xl"
      >
        {starters.map((starter) => (
          <button
            key={starter.label}
            onClick={() => onSelectPrompt(`Help me ${starter.label.toLowerCase()} something`)}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border border-border-subtle bg-gradient-to-br ${starter.color} hover:glass-active transition-all duration-200 text-left group`}
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center text-accent-primary group-hover:scale-105 transition-transform">
              {starter.icon}
            </div>
            <span className="text-sm font-medium text-text-primary">{starter.label}</span>
            <span className="text-[10px] text-text-muted">{starter.desc}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
