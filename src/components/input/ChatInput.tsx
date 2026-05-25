'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MicButton } from './MicButton';
import { SendButton } from './SendButton';
import { ModelSelector } from '@/components/header/ModelSelector';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { Paperclip } from 'lucide-react';

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
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
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
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-bg-base via-bg-base/90 to-transparent pt-10 pb-6 px-4 flex justify-center z-40">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="bg-bg-base border border-border-subtle rounded-xl p-2 flex items-end gap-2 focus-within:border-accent-primary/50 transition-colors">
          <div className="flex-1 flex flex-col">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? 'Waiting for response...' : `Message Axion${mode === 'code' ? ' (Code Mode)' : mode === 'research' ? ' (Deep Research)' : ''}...`}
              rows={1}
              disabled={isStreaming}
              className="w-full bg-transparent border-none outline-none resize-none px-2 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-0 disabled:opacity-50"
              style={{ maxHeight: '150px' }}
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <ModelSelector />
              <div className="flex items-center gap-1 text-text-muted">
                <button type="button" className="p-1.5 rounded hover:bg-[var(--hover-bg)] transition-colors" title="Attach file">
                  <Paperclip size={20} />
                </button>
                <MicButton onTranscript={handleTranscript} />
              </div>
            </div>
          </div>
          <SendButton disabled={!input.trim() || isStreaming} isStreaming={isStreaming} onStop={stopGeneration} />
        </div>
        <p className="text-[10px] text-text-muted text-center mt-2">
          Axion can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
}
