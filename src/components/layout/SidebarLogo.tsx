'use client';
import { motion } from 'framer-motion';

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-3">
      <motion.div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #CF7455 0%, #E8956A 100%)' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.15 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 14 L9 4 L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 10.5 H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-[15px] font-semibold text-text-primary tracking-tight">Axion</span>
      </div>
    </div>
  );
}
