'use client';
import { Settings, LogOut, User, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
    <div className="mt-auto pt-3 px-3 pb-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-sm"
            style={{}}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover-bg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: 'rgba(207,116,85,0.15)', color: 'var(--color-accent-primary)' }}>
              {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{session?.user?.name || 'User'}</p>
              <p className="text-[10px] text-text-muted truncate">{session?.user?.email || ''}</p>
            </div>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
            <LogOut size={14} className="mr-2" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
