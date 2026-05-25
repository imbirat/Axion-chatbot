'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MessageSquare, Pin } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarLogo } from './SidebarLogo';
import { SidebarChatItem } from './SidebarChatItem';
import { SidebarFooter } from './SidebarFooter';
import { useChatStore } from '@/store/chatStore';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useSettingsStore } from '@/store/settingsStore';
import { cn } from '@/lib/utils';

function getGroupLabel(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days <= 7) return 'Previous 7 Days';
  return 'Older';
}

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

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredChats> = {};
    const unpinned = filteredChats.filter((c) => !c.pinned);
    for (const chat of unpinned) {
      const label = getGroupLabel(new Date(chat.createdAt));
      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    }
    return groups;
  }, [filteredChats]);

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
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 300 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden glass-surface rounded-none border-l-0 border-t-0 border-b-0"
    >
      {!sidebarCollapsed ? (
        <>
          <div className="px-4 pt-4 pb-3">
            <SidebarLogo />

            <button
              onClick={handleNewChat}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-accent-primary/20"
            >
              <Plus size={16} />
              New Chat
            </button>

            <div className="mt-3 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="w-full bg-bg-elevated/50 rounded-xl pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none border border-border-subtle focus:border-accent-primary/40 transition-colors"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
            {pinnedChats.length > 0 && (
              <div className="mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5">
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
              </div>
            )}

            {Object.entries(grouped).map(([label, groupChats]) => (
              <div key={label} className="mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5">
                  <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">{label}</span>
                </div>
                {groupChats.map((chat) => (
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
              </div>
            ))}

            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare size={24} className="text-text-muted/30 mb-3" />
                <p className="text-sm text-text-muted">No conversations yet</p>
                <p className="text-xs text-text-muted/60 mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>

          <SidebarFooter />
        </>
      ) : (
        <div className="flex flex-col items-center py-4 gap-4 flex-1">
          <div className="w-9 h-9 rounded-xl bg-accent-primary flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <button
            onClick={handleNewChat}
            className="w-9 h-9 rounded-xl bg-accent-primary/15 flex items-center justify-center text-accent-primary hover:bg-accent-primary/25 transition-colors"
          >
            <Plus size={16} />
          </button>
          <div className="flex-1" />
          <SidebarFooter />
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10 shadow-md"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn('transition-transform duration-300', sidebarCollapsed && 'rotate-180')}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </motion.aside>
  );
}
