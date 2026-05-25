'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, Pencil, CheckCheck, X } from 'lucide-react';
import { Message } from '@/types/chat';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { ReasoningPanel } from './ReasoningPanel';
import { StreamCursor } from './StreamCursor';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  isLast?: boolean;
  onRegenerate?: () => void;
  onEdit?: (newContent: string) => void;
  chatId?: string | null;
  messageIndex?: number;
  initialReaction?: 'up' | 'down' | null;
}

export function MessageBubble({ message, isStreaming, isLast, onRegenerate, onEdit, chatId, messageIndex, initialReaction }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(typeof message.content === 'string' ? message.content : '');
  const [reaction, setReaction] = useState<'up' | 'down' | null>(initialReaction || null);
  const [reactionLoading, setReactionLoading] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    const text = typeof message.content === 'string' ? message.content : '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== (typeof message.content === 'string' ? message.content : '')) {
      onEdit?.(editText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(typeof message.content === 'string' ? message.content : '');
    setIsEditing(false);
  };

  const handleReaction = async (type: 'up' | 'down') => {
    if (reactionLoading || !chatId || messageIndex === undefined) return;
    const newReaction = reaction === type ? null : type;
    setReaction(newReaction);
    setReactionLoading(true);
    try {
      await fetch(`/api/chats/${chatId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIndex, reaction: newReaction }),
      });
    } catch {
      setReaction(reaction);
    }
    setReactionLoading(false);
  };

  const displayContent = typeof message.content === 'string' ? message.content : '';

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
          {isUser && isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-[var(--color-bg-elevated)] text-text-primary rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent-primary/40 border border-border"
                rows={3}
                autoFocus
              />
              <div className="flex gap-1.5 justify-end">
                <button onClick={handleSaveEdit} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-primary transition-colors" title="Save">
                  <CheckCheck size={14} />
                </button>
                <button onClick={handleCancelEdit} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Cancel">
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : isUser ? (
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{displayContent}</p>
          ) : (
            <div className="prose prose-invert max-w-none text-sm">
              <MarkdownRenderer content={displayContent} />
              {isStreaming && isLast && <StreamCursor />}
            </div>
          )}
        </div>

        {!isStreaming && displayContent && isUser && (
          <div className="flex items-center gap-1 mt-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Copy">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            </button>
            {onEdit && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Edit">
                <Pencil size={12} />
              </button>
            )}
          </div>
        )}

        {isAssistant && !isStreaming && displayContent && (
          <div className="flex items-center gap-1 mt-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => handleReaction('up')}
              className={cn(
                'p-1 rounded hover:bg-[var(--hover-bg)] transition-colors',
                reaction === 'up' ? 'text-green-600' : 'text-text-muted hover:text-green-600'
              )}
              title="Good response"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => handleReaction('down')}
              className={cn(
                'p-1 rounded hover:bg-[var(--hover-bg)] transition-colors',
                reaction === 'down' ? 'text-red-500' : 'text-text-muted hover:text-red-500'
              )}
              title="Bad response"
            >
              <ThumbsDown size={12} />
            </button>
            <button onClick={handleCopy} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Copy">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            </button>
            {onRegenerate && (
              <button onClick={onRegenerate} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors" title="Regenerate">
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        )}

        {isAssistant && message.model && !isStreaming && (
          <p className="text-[10px] text-text-muted mt-1 px-2">{message.model}</p>
        )}
      </div>
    </motion.div>
  );
}
