'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Atom, Code, FileText, Bug } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const suggestions = [
  { text: 'Explain quantum computing', icon: Atom },
  { text: 'Write a Python script', icon: Code },
  { text: 'Summarize a topic', icon: FileText },
  { text: 'Help me debug code', icon: Bug },
];

export function WelcomeScreen() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex-1 flex justify-center w-full pt-32 pb-32">
      <div className="w-full max-w-[720px] px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #CF7455 0%, #E8956A 100%)' }}
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path d="M4 14 L9 4 L14 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10.5 H12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-semibold text-text-primary mb-2 tracking-tight">
            {getGreeting()}, {name}
          </h1>
          <p className="text-[15px] text-text-secondary max-w-sm mx-auto leading-relaxed">
            How can I help you today?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-2.5 w-full max-w-[520px]">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm text-text-secondary hover:text-text-primary transition-all duration-200 text-left group border"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border-subtle)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(207,116,85,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
                }}
                onClick={() => {
                  const event = new CustomEvent('axion-suggest', { detail: s.text });
                  window.dispatchEvent(event);
                }}
              >
                <Icon size={15} className="shrink-0 text-accent-primary" />
                <span className="font-medium text-[13px]">{s.text}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
