'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Pin, Trash2, PencilLine, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';

interface SidebarChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onPin: () => void;
}

const previewLength = 60;

function getPreview(chat: Chat): string {
  const lastMsg = chat.messages?.[chat.messages.length - 1];
  if (!lastMsg) return '';
  const text = typeof lastMsg.content === 'string' ? lastMsg.content : '';
  return text.length > previewLength ? text.slice(0, previewLength) + '...' : text;
}

export function SidebarChatItem({ chat, isActive, onClick, onRename, onDelete, onPin }: SidebarChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const [showActions, setShowActions] = useState(false);

  const handleRename = () => {
    if (editTitle.trim()) onRename(editTitle.trim());
    setIsEditing(false);
  };

  const preview = getPreview(chat);

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
        isActive
          ? 'bg-accent-primary/10'
          : 'hover:bg-[var(--hover-bg)]'
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 mt-0.5">
        <MessageSquare size={13} className="text-text-muted" />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            className="w-full bg-bg-elevated rounded px-2 py-1 text-sm text-text-primary border border-accent-primary/40 outline-none"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsEditing(false); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span className="block text-sm font-medium text-text-primary truncate leading-tight">{chat.title}</span>
            {preview && (
              <span className="block text-[11px] text-text-muted mt-0.5 truncate leading-tight">{preview}</span>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onPin} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors">
              <Pin size={12} className={chat.pinned ? 'text-accent-primary fill-accent-primary' : ''} />
            </button>
            <button onClick={() => { setIsEditing(true); setEditTitle(chat.title); }} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors">
              <PencilLine size={12} />
            </button>
            <button onClick={onDelete} className="p-1 rounded hover:bg-[var(--hover-bg)] text-text-muted hover:text-error transition-colors">
              <Trash2 size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
