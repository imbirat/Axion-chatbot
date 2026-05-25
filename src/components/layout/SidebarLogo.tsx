'use client';
import { motion } from 'framer-motion';

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-3">
      <motion.div
        className="w-9 h-9 rounded-xl bg-accent-primary flex items-center justify-center font-bold text-white text-sm shadow-md shadow-accent-primary/20"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.15 }}
      >
        A
      </motion.div>
      <div className="flex flex-col">
        <span className="text-base font-semibold text-text-primary tracking-tight">AXION</span>
        <span className="text-[9px] font-medium text-text-muted uppercase tracking-[0.2em]">AI</span>
      </div>
    </div>
  );
}
