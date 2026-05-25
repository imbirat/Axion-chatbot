'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MicButton } from './MicButton';
import { SendButton } from './SendButton';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';

const DRAFT_KEY = 'axion-draft';

export function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming, mode, selectedModel } = useChatStore();
  const { sendMessage, stopGeneration } = useChat();

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setInput(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, input);
  }, [input]);

  const autoResize = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    localStorage.removeItem(DRAFT_KEY);
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTranscript = (text: string) => {
    setInput((prev) => prev + text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.3 }}
      className="px-4 md:px-6 pb-4 pt-2 bg-gradient-to-t from-bg-base via-bg-base to-transparent"
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="glass-surface focus-within:input-focused transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Waiting for response...' : `Message Axion${mode === 'code' ? ' (Code Mode)' : mode === 'research' ? ' (Deep Research)' : ''}...`}
            rows={1}
            disabled={isStreaming}
            className="w-full bg-transparent border-none outline-none resize-none px-4 pt-3 pb-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-0 disabled:opacity-50"
            style={{ maxHeight: '200px' }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-bg-elevated/50 border border-border-subtle text-[10px] font-medium text-text-muted hover:text-text-secondary transition-colors"
                disabled={isStreaming}
              >
                {selectedModel}
              </button>
              <MicButton onTranscript={handleTranscript} />
            </div>
            <SendButton disabled={!input.trim() || isStreaming} isStreaming={isStreaming} onStop={stopGeneration} />
          </div>
        </div>
        <p className="text-[10px] text-text-muted text-center mt-2">
          Axion can make mistakes. Verify important information.
        </p>
      </form>
    </motion.div>
  );
}
