'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Check, RefreshCw,
  ThumbsUp, ThumbsDown,
  Pencil, CheckCheck, X,
} from 'lucide-react';
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

function ActionBtn({
  onClick,
  title,
  active,
  activeColor,
  children,
}: {
  onClick?: () => void;
  title: string;
  active?: boolean;
  activeColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center gap-1 p-1 rounded-md transition-colors duration-150"
      style={{
        color: active && activeColor
          ? activeColor
          : 'var(--color-text-muted)',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span
      className="inline-block w-px h-3.5 mx-0.5"
      style={{ background: 'var(--color-border-subtle)' }}
    />
  );
}

export function MessageBubble({
  message, isStreaming, isLast,
  onRegenerate, onEdit,
  chatId, messageIndex, initialReaction,
}: MessageBubbleProps) {
  const [copied,          setCopied]          = useState(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [editText,        setEditText]        = useState(
    typeof message.content === 'string' ? message.content : ''
  );
  const [reaction,        setReaction]        = useState<'up' | 'down' | null>(initialReaction ?? null);
  const [reactionLoading, setReactionLoading] = useState(false);

  const isUser      = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const displayContent =
    typeof message.content === 'string' ? message.content : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== displayContent) onEdit?.(editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(displayContent);
    setIsEditing(false);
  };

  const handleReaction = async (type: 'up' | 'down') => {
    if (reactionLoading || !chatId || messageIndex === undefined) return;
    const next = reaction === type ? null : type;
    setReaction(next);
    setReactionLoading(true);
    try {
      await fetch(`/api/chats/${chatId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIndex, reaction: next }),
      });
    } catch {
      setReaction(reaction);
    }
    setReactionLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group flex w-full mb-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          isUser
            ? 'max-w-[75%] md:max-w-[60%]'
            : 'max-w-[90%] md:max-w-[760px] w-full'
        )}
      >

        {isAssistant && message.reasoning && (
          <ReasoningPanel
            content={message.reasoning}
            isStreaming={isStreaming ?? false}
          />
        )}

        {/* ═══ USER MESSAGE ═══ */}
        {isUser && (
          <div className="flex flex-col items-end gap-1">

            {isEditing ? (
              <div
                className="w-full rounded-2xl p-3 flex flex-col gap-2"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={3}
                  autoFocus
                  className="w-full bg-transparent text-[14.5px] text-text-primary resize-none outline-none leading-relaxed"
                />
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium text-white transition-colors"
                    style={{ background: 'var(--color-accent-primary)' }}
                  >
                    <CheckCheck size={12} /> Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium text-text-muted hover:text-text-primary transition-colors"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)' }}
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl px-4 py-2.5 text-[14.5px] text-text-primary leading-relaxed whitespace-pre-wrap"
                style={{ background: 'var(--message-user-bg)' }}
              >
                {displayContent}
              </div>
            )}

            {!isStreaming && displayContent && !isEditing && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pr-0.5">
                {onEdit && (
                  <ActionBtn
                    onClick={() => setIsEditing(true)}
                    title="Edit message"
                  >
                    <Pencil size={13} />
                    <span className="text-[11px]">Edit</span>
                  </ActionBtn>
                )}
                <ActionBtn onClick={handleCopy} title="Copy message">
                  {copied
                    ? <><Check size={13} style={{ color: 'var(--color-success)' }} /><span className="text-[11px]">Copied</span></>
                    : <><Copy size={13} /><span className="text-[11px]">Copy</span></>
                  }
                </ActionBtn>
                {onRegenerate && (
                  <>
                    <Divider />
                    <ActionBtn onClick={onRegenerate} title="Retry">
                      <RefreshCw size={13} />
                      <span className="text-[11px]">Retry</span>
                    </ActionBtn>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ AI MESSAGE ═══ */}
        {isAssistant && (
          <div className="flex flex-col gap-1">

            <div className="text-[15px] text-text-primary leading-[1.8]">
              <MarkdownRenderer content={displayContent} />
              {isStreaming && isLast && <StreamCursor />}
            </div>

            {message.model && !isStreaming && (
              <p className="text-[10px] text-text-muted font-mono px-0.5">
                {message.model}
              </p>
            )}

            {!isStreaming && displayContent && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-0.5">

                <ActionBtn onClick={handleCopy} title="Copy response">
                  {copied
                    ? <Check size={13} style={{ color: 'var(--color-success)' }} />
                    : <Copy size={13} />
                  }
                </ActionBtn>

                <Divider />

                <ActionBtn
                  onClick={() => handleReaction('up')}
                  title="Good response"
                  active={reaction === 'up'}
                  activeColor="var(--color-accent-primary)"
                >
                  <ThumbsUp size={13} />
                </ActionBtn>

                <ActionBtn
                  onClick={() => handleReaction('down')}
                  title="Bad response"
                  active={reaction === 'down'}
                  activeColor="var(--color-error)"
                >
                  <ThumbsDown size={13} />
                </ActionBtn>

                {onRegenerate && (
                  <>
                    <Divider />
                    <ActionBtn onClick={onRegenerate} title="Retry">
                      <RefreshCw size={13} />
                    </ActionBtn>
                  </>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
