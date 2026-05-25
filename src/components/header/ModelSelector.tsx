'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Brain } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { MODELS } from '@/config/models.config';
import { AxionModel } from '@/types/models';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  basic: <Zap size={14} />,
  main: <Brain size={14} />,
};

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedModel, setSelectedModel, mode } = useChatStore();
  const currentModel = MODELS[selectedModel];

  const modeModels = Object.values(MODELS).filter((m) => {
    if (mode === 'code') return m.id.includes('coder');
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[11px] font-medium text-text-muted hover:text-text-secondary transition-all"
      >
        {currentModel && categoryIcons[currentModel.category]}
        <span>{currentModel?.name || 'Select'}</span>
        <ChevronDown size={10} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute bottom-full mb-2 left-0 w-64 p-1.5 z-50 rounded-2xl shadow-lg"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {(['main', 'basic'] as const).map((category) => {
              const models = modeModels.filter((m) => m.category === category);
              if (models.length === 0) return null;
              return (
                <div key={category} className="mb-0.5">
                  <div className="px-3 py-1.5 text-[9px] font-medium text-text-muted uppercase tracking-widest">
                    {category === 'main' ? 'Main' : 'Basic'}
                  </div>
                    {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleSelect(model)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150',
                        selectedModel === model.id
                          ? 'text-accent-primary'
                          : 'text-text-secondary hover:bg-[var(--hover-bg)] hover:text-text-primary'
                      )}
                      style={selectedModel === model.id ? { background: 'rgba(207,116,85,0.10)' } : {}}
                    >
                      <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center', selectedModel === model.id ? '' : 'bg-bg-elevated')}
                        style={selectedModel === model.id ? { background: 'rgba(207,116,85,0.15)' } : {}}>
                        {categoryIcons[model.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{model.name}</div>
                        <div className="text-[9px] text-text-muted truncate">{model.description}</div>
                      </div>
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
