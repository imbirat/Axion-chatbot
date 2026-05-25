'use client';
import { ModeSelector } from './ModeSelector';
import { AccountCircle, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function ChatHeader() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-center px-6 h-14 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md shrink-0">
      <nav className="hidden md:flex items-center gap-8">
        <ModeSelector />
      </nav>
      <div className="absolute right-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/settings')}
          className="text-text-muted hover:text-accent-primary transition-colors"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={() => router.push('/settings')}
          className="text-text-muted hover:text-accent-primary transition-colors"
        >
          <AccountCircle size={22} />
        </button>
      </div>
    </header>
  );
}
