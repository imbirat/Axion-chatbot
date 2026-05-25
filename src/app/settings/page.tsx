'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSettingsStore } from '@/store/settingsStore';
import { useChatStore } from '@/store/chatStore';
import { Moon, Sun, Trash2, Mail, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const {
    theme, toggleTheme, fontSize, setFontSize, enterToSend, setEnterToSend,
    customInstructions, setCustomInstructions,
    customInstructionsEnabled, setCustomInstructionsEnabled,
  } = useSettingsStore();
  const { chats, setChats, setMessages, setActiveChatId } = useChatStore();
  const router = useRouter();

  const [localInstructions, setLocalInstructions] = useState(customInstructions);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetch('/api/user/instructions')
        .then((res) => res.json())
        .then((data) => {
          if (data.customInstructions !== undefined) {
            setCustomInstructions(data.customInstructions);
            setLocalInstructions(data.customInstructions);
          }
          if (data.customInstructionsEnabled !== undefined) {
            setCustomInstructionsEnabled(data.customInstructionsEnabled);
          }
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
    }
  }, [loaded, setCustomInstructions, setCustomInstructionsEnabled]);

  useEffect(() => {
    if (loaded) {
      setLocalInstructions(customInstructions);
    }
  }, [customInstructions, loaded]);

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

  const handleSaveInstructions = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/user/instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customInstructions: localInstructions,
          customInstructionsEnabled,
        }),
      });
      if (res.ok) {
        setCustomInstructions(localInstructions);
        setSaved(true);
        toast.success('Custom instructions saved');
        setTimeout(() => setSaved(false), 2000);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save instructions');
    }
    setSaving(false);
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary hover:bg-[var(--hover-bg)] transition-colors"
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

          {/* Custom Instructions */}
          <section className="glass-surface p-6">
            <h2 className="text-sm font-medium text-text-primary mb-4">Custom Instructions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Enable custom instructions</span>
                <button
                  onClick={() => {
                    setCustomInstructionsEnabled(!customInstructionsEnabled);
                    if (loaded) {
                      fetch('/api/user/instructions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ customInstructionsEnabled: !customInstructionsEnabled }),
                      }).catch(() => {});
                    }
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${customInstructionsEnabled ? 'bg-accent-primary' : 'bg-bg-elevated'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${customInstructionsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {customInstructionsEnabled && (
                <>
                  <div className="relative">
                    <textarea
                      value={localInstructions}
                      onChange={(e) => {
                        if (e.target.value.length <= 1500) setLocalInstructions(e.target.value);
                      }}
                      placeholder="e.g. Always respond in Spanish. Prefer bullet points. You are an expert in molecular biology..."
                      rows={4}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-lg p-3 text-sm text-text-primary placeholder:text-text-muted/50 resize-none focus:outline-none focus:ring-1 focus:ring-accent-primary/40"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-text-muted">
                      {localInstructions.length}/1500
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveInstructions}
                      disabled={saving}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
                    >
                      {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </>
              )}
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
