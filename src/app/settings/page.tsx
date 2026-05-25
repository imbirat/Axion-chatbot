'use client';
import { useSession } from 'next-auth/react';
import { useSettingsStore } from '@/store/settingsStore';
import { useChatStore } from '@/store/chatStore';
import { Moon, Sun, Trash2, Mail, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme, fontSize, setFontSize, enterToSend, setEnterToSend } = useSettingsStore();
  const { chats, setChats, setMessages, setActiveChatId } = useChatStore();
  const router = useRouter();

  const handleClearChats = async () => {
    try {
      const res = await fetch('/api/chats', { method: 'DELETE' });
      if (res.ok) {
        setChats([]);
        setMessages([]);
        setActiveChatId(null);
        toast.success('Chat history cleared');
      }
    } catch {
      toast.error('Failed to clear chats');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center px-6 h-14 border-b border-border-subtle bg-bg-surface/50 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Profile */}
          <section className="glass-surface p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <User size={16} className="text-accent-primary" /> Profile
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-sm font-medium text-accent-primary">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm text-text-primary">{session?.user?.name}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1"><Mail size={10} /> {session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </section>

          {/* Appearance */}
          <section className="glass-surface p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary hover:bg-white/5 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Font Size</span>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary outline-none"
                >
                  <option value="sm">Small</option>
                  <option value="base">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Enter to send</span>
                <button
                  onClick={() => setEnterToSend(!enterToSend)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${enterToSend ? 'bg-accent-primary' : 'bg-bg-elevated'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enterToSend ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="glass-surface p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4">Privacy</h2>
            <div className="space-y-3">
              <button
                onClick={handleClearChats}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors w-full"
              >
                <Trash2 size={14} /> Clear all chat history
              </button>
              <p className="text-xs text-text-muted">This action cannot be undone. All conversations will be permanently deleted.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
