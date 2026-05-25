'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MessageSquare, Pin } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  if (days <= 7) return 'Previous 7 days';
  return 'Older';
}

export function Sidebar() {
  const router = useRouter();
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
      animate={{ width: sidebarCollapsed ? 56 : 260 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full z-50 hidden md:flex flex-col overflow-hidden"
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {!sidebarCollapsed ? (
        <>
          <div className="px-3 pt-4 pb-2">
            <SidebarLogo />

            <button
              onClick={handleNewChat}
              className="mt-4 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-[var(--hover-bg)] transition-all duration-150"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-accent-primary)' }}
              >
                <Plus size={13} color="white" strokeWidth={2.5} />
              </div>
              New chat
            </button>

            <div className="mt-2 relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                className="w-full rounded-xl pl-8 pr-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted outline-none transition-colors"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                }}
                placeholder="Search chats…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(207,116,85,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border-subtle)')}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {pinnedChats.length > 0 && (
              <div className="mb-1 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1">
                  <Pin size={9} className="text-text-muted" />
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
              <div key={label} className="mb-1 mt-2">
                <span className="block px-3 py-1 text-[10px] font-medium text-text-muted uppercase tracking-widest">
                  {label}
                </span>
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
                <MessageSquare size={20} className="text-text-muted/30 mb-3" />
                <p className="text-[13px] text-text-muted">No conversations yet</p>
                <p className="text-[11px] text-text-muted/60 mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>

          <SidebarFooter />
        </>
      ) : (
        <div className="flex flex-col items-center py-4 gap-3 flex-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #CF7455 0%, #E8956A 100%)' }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M4 14 L9 4 L14 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10.5 H12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <button
            onClick={handleNewChat}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-[var(--hover-bg)] transition-colors"
            title="New chat"
          >
            <Plus size={16} />
          </button>
          <div className="flex-1" />
          <SidebarFooter />
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors z-10 shadow-sm"
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={cn('transition-transform duration-300', sidebarCollapsed && 'rotate-180')}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </motion.aside>
  );
}
