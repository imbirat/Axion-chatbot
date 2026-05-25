'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const suggestions = [
  { text: 'Explain quantum computing', icon: '⚛' },
  { text: 'Write a Python script', icon: '🐍' },
  { text: 'Summarize a topic', icon: '📝' },
  { text: 'Help me debug code', icon: '🔍' },
];

export function WelcomeScreen() {
  const { data: session } = useSession();
  const name = session?.user?.name || 'there';

  return (
    <div className="flex-1 flex justify-center w-full pt-32 pb-32">
      <div className="w-full max-w-[760px] px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-6 border border-accent-primary/20">
            <span className="text-2xl font-bold text-accent-primary">A</span>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2 tracking-tight">
            {getGreeting()}, {name}
          </h1>
          <p className="text-base text-text-secondary max-w-md mx-auto">
            How can I help you today?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl glass-surface text-sm text-text-secondary hover:text-text-primary hover:border-accent-primary/20 transition-all duration-200 text-left group"
              onClick={() => {
                const event = new CustomEvent('axion-suggest', { detail: s.text });
                window.dispatchEvent(event);
              }}
            >
              <span className="text-base">{s.icon}</span>
              <span className="font-medium">{s.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
