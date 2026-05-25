'use client';
import { Settings, HelpCircle, LogOut, User, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SidebarFooter() {
  const { theme, toggleTheme } = useSettingsStore();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="mt-auto pt-3 border-t border-border-subtle space-y-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--hover-bg)] transition-colors text-sm text-text-secondary hover:text-text-primary">
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs font-medium text-accent-primary">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <span className="truncate">{session?.user?.name || 'User'}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" sideOffset={8} className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-text-primary">{session?.user?.name}</p>
            <p className="text-xs text-text-muted">{session?.user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings size={14} className="mr-2" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle size={14} className="mr-2" /> Help
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
            <LogOut size={14} className="mr-2" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors text-xs text-text-muted hover:text-text-secondary">
        <Settings size={14} />
        <span>Settings</span>
      </button>
    </div>
  );
}
