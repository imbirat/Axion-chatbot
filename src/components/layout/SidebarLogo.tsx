'use client';
import { motion } from 'framer-motion';

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <motion.div
        className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-white text-lg"
        whileHover={{ scale: 1.05, rotate: -3 }}
        transition={{ duration: 0.15 }}
      >
        A
      </motion.div>
      <div className="flex flex-col">
        <span className="text-base font-semibold text-text-primary tracking-tight">AXION</span>
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">AI</span>
      </div>
    </div>
  );
}
