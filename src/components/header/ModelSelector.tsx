'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Zap, Brain, Cpu, AlertCircle } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { MODELS } from '@/config/models.config';
import { AxionModel } from '@/types/models';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  basic: <Zap size={14} />,
  main: <Brain size={14} />,
  thinking: <Sparkles size={14} />,
  premium: <Cpu size={14} />,
};

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, setSelectedModel, mode } = useChatStore();
  const currentModel = MODELS[selectedModel];

  const modeModels = Object.values(MODELS).filter((m) => {
    if (mode === 'code') return m.id.includes('coder') || m.category === 'thinking';
    if (mode === 'research') return m.category === 'premium' || m.category === 'thinking' || m.category === 'main';
    return !m.id.includes('coder');
  });

  const handleSelect = (model: AxionModel) => {
    setSelectedModel(model.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated/50 border border-border-subtle text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all"
      >
        {currentModel && categoryIcons[currentModel.category]}
        <span>{currentModel?.name || 'Select Model'}</span>
        {currentModel?.rateLimited && <AlertCircle size={10} className="text-warning" />}
        <ChevronDown size={12} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full mt-2 left-0 w-72 glass-surface p-2 z-50"
          >
            {(['premium', 'thinking', 'main', 'basic'] as const).map((category) => {
              const models = modeModels.filter((m) => m.category === category);
              if (models.length === 0) return null;
              return (
                <div key={category} className="mb-1">
                  <div className="px-3 py-1.5 text-[10px] font-medium text-text-muted uppercase tracking-widest">
                    {category === 'premium' ? 'Premium' : category === 'thinking' ? 'Thinking' : category === 'main' ? 'Main' : 'Basic'}
                  </div>
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150',
                        selectedModel === model.id
                          ? 'bg-accent-primary/15 text-accent-primary'
                          : 'text-text-secondary hover:bg-[var(--hover-bg)] hover:text-text-primary'
                      )}
                    >
                      <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', selectedModel === model.id ? 'bg-accent-primary/20' : 'bg-bg-elevated')}>
                        {categoryIcons[model.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{model.name}</div>
                        <div className="text-[10px] text-text-muted truncate">{model.description}</div>
                      </div>
                      {model.rateLimited && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                          Limited
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
