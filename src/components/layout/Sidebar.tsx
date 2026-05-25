'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pin } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarLogo } from './SidebarLogo';
import { SidebarChatItem } from './SidebarChatItem';
import { SidebarFooter } from './SidebarFooter';
import { useChatStore } from '@/store/chatStore';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { chats, createChat, deleteChat, updateChatTitle, togglePin } = useChatHistory();
  const { activeChatId, setActiveChatId, searchQuery, setSearchQuery } = useChatStore();
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter((c) => c.pinned);
  const recentChats = filteredChats.filter((c) => !c.pinned);

  const handleNewChat = async () => {
    const chat = await createChat();
    if (chat) router.push(`/chat/${chat._id}`);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    router.push(`/chat/${chatId}`);
  };

  return (
    <motion.aside
      initial={{ width: sidebarCollapsed ? 56 : 260 }}
      animate={{ width: sidebarCollapsed ? 56 : 260 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full bg-bg-surface border-r border-border-subtle z-50 flex flex-col overflow-hidden"
    >
      {!sidebarCollapsed ? (
        <>
          <SidebarLogo />

          <button
            onClick={handleNewChat}
            className="mx-3 mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 text-sm font-medium text-accent-primary hover:from-accent-primary/30 hover:to-accent-secondary/30 active:scale-[0.98] transition-all duration-200"
          >
            <Plus size={16} />
            New Chat
          </button>

          <div className="px-3 mb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated/50 border border-border-subtle">
              <Search size={14} className="text-text-muted" />
              <input
                className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted w-full"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
            {pinnedChats.length > 0 && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-2">
                  <Pin size={10} className="text-text-muted" />
                  <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">Pinned</span>
                </div>
                {pinnedChats.map((chat) => (
                  <SidebarChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={activeChatId === chat._id}
                    onClick={() => handleSelectChat(chat._id)}
                    onRename={(title) => updateChatTitle(chat._id, title)}
                    onDelete={() => deleteChat(chat._id)}
                    onPin={() => togglePin(chat._id, !chat.pinned)}
                  />
                ))}
                <div className="h-2" />
              </>
            )}
            
            {pinnedChats.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">Recent</span>
              </div>
            )}
            
            {recentChats.map((chat) => (
              <SidebarChatItem
                key={chat._id}
                chat={chat}
                isActive={activeChatId === chat._id}
                onClick={() => handleSelectChat(chat._id)}
                onRename={(title) => updateChatTitle(chat._id, title)}
                onDelete={() => deleteChat(chat._id)}
                onPin={() => togglePin(chat._id, !chat.pinned)}
              />
            ))}

            {filteredChats.length === 0 && (
              <p className="text-xs text-text-muted text-center py-8">No conversations yet</p>
            )}
          </div>

          <SidebarFooter />
        </>
      ) : (
        <div className="flex flex-col items-center py-4 gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-white text-lg">
            A
          </div>
          <button
            onClick={handleNewChat}
            className="w-9 h-9 rounded-xl bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-accent-primary hover:bg-accent-primary/30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn('transition-transform', sidebarCollapsed && 'rotate-180')}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </motion.aside>
  );
}
