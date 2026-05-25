'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, MoreHorizontal, Pin, Trash2, PencilLine } from 'lucide-react';
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

export function SidebarChatItem({ chat, isActive, onClick, onRename, onDelete, onPin }: SidebarChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const [showActions, setShowActions] = useState(false);

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
        isActive
          ? 'bg-accent-primary/10 border-l-2 border-accent-primary'
          : 'hover:bg-[var(--hover-bg)] border-l-2 border-transparent'
      )}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <MessageSquare size={16} className="text-text-muted shrink-0" />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            className="w-full bg-bg-elevated rounded px-2 py-0.5 text-sm text-text-primary border border-accent-primary/30 outline-none"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsEditing(false); }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="block text-sm text-text-primary truncate">{chat.title}</span>
        )}
        <span className="text-[10px] text-text-muted">{chat.mode}</span>
      </div>

      <AnimatePresence>
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-0.5"
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
