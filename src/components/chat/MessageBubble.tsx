'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Volume2, VolumeX } from 'lucide-react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ReasoningPanel } from './ReasoningPanel';
import { StreamCursor } from './StreamCursor';
import { useVoice } from '@/hooks/useVoice';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  isLast?: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, isStreaming, isLast, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const { speakText, stopSpeaking, speakingMessageId } = useVoice();
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSpeak = () => {
    if (speakingMessageId === message._id) {
      stopSpeaking();
    } else {
      speakText(message.content, message._id || '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex w-full mb-6', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('max-w-[85%] md:max-w-[70%]', isUser && 'order-1')}>
        {isAssistant && message.reasoning && (
          <ReasoningPanel content={message.reasoning} isStreaming={isStreaming || false} />
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-accent-primary/10 border border-accent-primary/20 rounded-tr-sm'
              : 'glass-surface'
          )}
        >
          {isUser ? (
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none text-sm">
              <MarkdownRenderer content={message.content} />
              {isStreaming && isLast && <StreamCursor />}
            </div>
          )}
        </div>

        {isAssistant && !isStreaming && message.content && (
          <div className="flex items-center gap-1 mt-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Copy">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Regenerate">
                <RefreshCw size={12} />
              </button>
            )}
            <button onClick={handleSpeak} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Read aloud">
              {speakingMessageId === message._id ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          </div>
        )}

        {isAssistant && message.model && !isStreaming && (
          <p className="text-[10px] text-text-muted mt-1 px-2">{message.model}</p>
        )}
      </div>
    </motion.div>
  );
}
