'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Trash2, PencilLine } from 'lucide-react';
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
    if (editTitle.trim()) onRename(editTitle.trim());
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150',
        isActive
          ? 'bg-[var(--hover-bg)]'
          : 'hover:bg-[var(--hover-bg)]'
      )}
      style={isActive ? { borderLeft: '2px solid var(--color-accent-primary)', paddingLeft: '10px' } : {}}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            className="w-full rounded-lg px-2 py-0.5 text-[13px] text-text-primary outline-none"
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid rgba(207,116,85,0.4)',
            }}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="block text-[13px] font-normal text-text-secondary truncate leading-snug group-hover:text-text-primary transition-colors">
            {chat.title}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-0.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onPin}
              className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors"
              title={chat.pinned ? 'Unpin' : 'Pin'}
            >
              <Pin size={11} className={chat.pinned ? 'text-accent-primary fill-accent-primary' : ''} />
            </button>
            <button
              onClick={() => { setIsEditing(true); setEditTitle(chat.title); }}
              className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-text-muted hover:text-text-primary transition-colors"
              title="Rename"
            >
              <PencilLine size={11} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded-lg hover:bg-[var(--hover-bg)] text-text-muted hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
