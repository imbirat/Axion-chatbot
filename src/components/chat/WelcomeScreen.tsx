'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function WelcomeScreen() {
  const { data: session } = useSession();
  const name = session?.user?.name || 'there';

  return (
    <div className="flex-1 overflow-y-auto flex justify-center w-full pt-24 pb-32">
      <div className="w-full max-w-[800px] px-6 flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center flex flex-col items-center"
        >
          <p className="text-base text-text-secondary mb-1">
            {getGreeting()}, <span className="text-accent-primary font-medium">@{name}</span>
          </p>
          <h1 className="text-[40px] font-bold text-accent-primary opacity-90 tracking-tighter leading-[48px]">
            AXION
          </h1>
          <p className="text-lg text-text-secondary mt-2 max-w-lg text-center">
            How can I help you today?
          </p>
        </motion.div>
      </div>
    </div>
  );
}
