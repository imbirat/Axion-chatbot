'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { ArtifactProvider, useArtifact } from '@/context/ArtifactContext';
import { ArtifactPanel } from '@/components/artifacts/ArtifactPanel';
import { ShortcutsModal } from '@/components/ui/ShortcutsModal';
import { useSettingsStore } from '@/store/settingsStore';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { useHotkeys } from '@/hooks/useHotkeys';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();
  const { isStreaming, messages } = useChatStore();
  const { stopGeneration } = useChat();
  const { activeArtifact } = useArtifact();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const router = useRouter();

  const handleNewChat = useCallback(() => {
    const newId = 'chat_' + Date.now();
    router.push(`/chat/${newId}`);
  }, [router]);

  const handleCopyLastAssistant = useCallback(async () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistant) {
      const text = typeof lastAssistant.content === 'string' ? lastAssistant.content : '';
      await navigator.clipboard.writeText(text);
    }
  }, [messages]);

  const stopGen = useCallback(() => {
    if (isStreaming) {
      stopGeneration?.();
    }
  }, [isStreaming, stopGeneration]);

  useHotkeys({
    'meta+k': handleNewChat,
    'ctrl+k': handleNewChat,
    'meta+/': toggleSidebar,
    'ctrl+/': toggleSidebar,
    'escape': stopGen,
    'meta+shift+c': handleCopyLastAssistant,
    'ctrl+shift+c': handleCopyLastAssistant,
    'meta+?': () => setShortcutsOpen(true),
    'ctrl+?': () => setShortcutsOpen(true),
  });

  return (
    <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 flex flex-col transition-all duration-220 ease-out overflow-hidden"
        style={{
          marginLeft: sidebarCollapsed ? 56 : 260,
          marginRight: activeArtifact ? 420 : 0,
        }}
      >
        {children}
      </main>
      <ArtifactPanel />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <ArtifactProvider>
      <AppShellInner>{children}</AppShellInner>
    </ArtifactProvider>
  );
}
